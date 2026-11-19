const express = require('express');
const http = require('http');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

require('dotenv').config();

const {
  connectDB,
  disconnectDB,
} = require('./config/db');

const redis = require('./config/redis');

const authRoutes = require('./routes/auth.routes');
const expenseRoutes = require('./routes/expense.routes');
const ocrRoutes = require('./routes/ocr.routes');
const analyticsRoutes = require('./routes/analytics.routes');
const importRoutes = require('./routes/import.routes');
const recurringRoutes = require('./routes/recurring.routes');
const exportRoutes = require('./routes/export.routes');
const oauthRoutes = require('./routes/oauth.routes');
const adminRoutes = require('./routes/admin.routes');
const budgetRoutes = require('./routes/budget.routes');

const { initWebSocket } = require('./services/websocket.service');

const { setupSwagger } = require('./config/swagger');

const {
  errorHandler,
  notFound,
} = require('./middleware/error.middleware');

const {
  processRecurring,
} = require('./controllers/recurring.controller');

const passport = require('./config/passport');
const session = require('express-session');

const app = express();
const server = http.createServer(app);

const PORT = Number(process.env.PORT || 8000);

let recurringTimer = null;
let isShuttingDown = false;

// ==========================================
// UPLOAD DIRECTORY
// ==========================================

const uploadsDir = path.join(__dirname, '..', 'uploads');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// ==========================================
// MIDDLEWARE
// ==========================================

app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  })
);

app.use(
  session({
    secret:
      process.env.JWT_ACCESS_SECRET ||
      'development-session-secret',
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==========================================
// HEALTH CHECK
// ==========================================

app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
  });
});

// ==========================================
// API ROUTES
// ==========================================

app.use('/api/auth', authRoutes);
app.use('/api/auth', oauthRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/ocr', ocrRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/import', importRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/recurring', recurringRoutes);
app.use('/api/export', exportRoutes);
app.use('/api/budgets', budgetRoutes);

// ==========================================
// WEBSOCKET
// ==========================================

initWebSocket(server);

// ==========================================
// SWAGGER
// ==========================================

setupSwagger(app);

// ==========================================
// ERROR HANDLING
// ==========================================

app.use(notFound);
app.use(errorHandler);

// ==========================================
// DATABASE AND REDIS SHUTDOWN
// ==========================================

const closeDependencies = async () => {
  const tasks = [];

  if (redis.status === 'ready') {
    tasks.push(
      redis.quit().then(() => {
        console.log('Redis connection closed');
      })
    );
  } else if (redis.status !== 'end') {
    redis.disconnect();
    console.log('Redis connection disconnected');
  }

  tasks.push(
    disconnectDB().catch((error) => {
      console.error(
        'PostgreSQL shutdown error:',
        error.message
      );
    })
  );

  await Promise.allSettled(tasks);
};

// ==========================================
// GRACEFUL SHUTDOWN
// ==========================================

const shutdown = async (exitCode = 0) => {
  if (isShuttingDown) {
    return;
  }

  isShuttingDown = true;

  console.log('Application shutdown initiated');

  if (recurringTimer) {
    clearInterval(recurringTimer);
    recurringTimer = null;
  }

  if (server.listening) {
    await new Promise((resolve) => {
      server.close((error) => {
        if (error) {
          console.error(
            'HTTP server shutdown error:',
            error.message
          );
        } else {
          console.log('HTTP server closed');
        }

        resolve();
      });

      if (typeof server.closeIdleConnections === 'function') {
        server.closeIdleConnections();
      }
    });
  }

  await closeDependencies();

  console.log('Application shutdown completed');

  process.exitCode = exitCode;
};

// ==========================================
// APPLICATION STARTUP
// ==========================================

const start = async () => {
  try {
    console.log('Starting ExpenseAI backend...');

    // PostgreSQL must connect before HTTP starts.
    await connectDB();

    await new Promise((resolve, reject) => {
      const onError = (error) => {
        reject(error);
      };

      server.once('error', onError);

      server.listen(PORT, () => {
        server.removeListener('error', onError);
        resolve();
      });
    });

    console.log(`Server running on port ${PORT}`);
    console.log('WebSocket server ready');

    // Process recurring expenses at startup.
    processRecurring().catch((error) => {
      console.error(
        'Recurring expense processing failed:',
        error.message
      );
    });

    // Schedule recurring processing every 24 hours.
    recurringTimer = setInterval(() => {
      processRecurring().catch((error) => {
        console.error(
          'Recurring expense processing failed:',
          error.message
        );
      });
    }, 24 * 60 * 60 * 1000);

    recurringTimer.unref();

    return server;
  } catch (error) {
    console.error('Application startup failed:', error.message);

    await shutdown(1);

    throw error;
  }
};

// ==========================================
// PROCESS SIGNAL HANDLING
// ==========================================

if (require.main === module) {
  process.once('SIGTERM', () => {
    shutdown(0).catch((error) => {
      console.error('SIGTERM shutdown failed:', error);
      process.exitCode = 1;
    });
  });

  process.once('SIGINT', () => {
    shutdown(0).catch((error) => {
      console.error('SIGINT shutdown failed:', error);
      process.exitCode = 1;
    });
  });

  start().catch(() => {
    process.exitCode = 1;
  });
}

module.exports = {
  app,
  server,
  start,
  shutdown,
};

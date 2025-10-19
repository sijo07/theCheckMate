import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";

const configureMiddleware = (app) => {
  app.use(helmet());
  app.use(cors());

  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  });
  app.use(limiter);
};

export default configureMiddleware;

import app from "./app";
import { envVars } from "./config/env";

const bootstrap = () => {
  try {
    app.listen(envVars.PORT, () => {
      console.log(`server is running on http://localhost:${envVars.PORT}`);
    });
  } catch (err) {
    console.log(err);
  }
};
bootstrap();

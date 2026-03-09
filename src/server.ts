import app from "./app";
import { envVars } from "./app/config/env";
import { seedSuperAdmin } from "./app/utils/seed";

const bootstrap = async () => {
  try {
     await seedSuperAdmin();
    app.listen(envVars.PORT, () => {
      console.log(`server is running on http://localhost:${envVars.PORT}`);
    });
  } catch (err) {
    console.log(err);
  }
};
bootstrap();

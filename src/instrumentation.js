export async function register() {
    if (process.env.NEXT_RUNTIME !== "nodejs") {
        return;
    }

    if (process.env.NODE_ENV !== "production") {
        return;
    }

    const { startBrandBnaloSyncCron } = await import("./lib/cron/brandBnaloCron.js");
    startBrandBnaloSyncCron();
}

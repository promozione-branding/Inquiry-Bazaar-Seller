
export async function register() {
    if (process.env.NODE_ENV === "production") {
        const { startBrandBnaloSyncCron } = await import("./lib/cron/brandBnaloCron.js");
        startBrandBnaloSyncCron();
    }
}
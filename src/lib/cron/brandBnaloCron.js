
import cron from "node-cron";
import { connectDB } from "@/config/db";
import Integration from "@/models/IntegrationSchema";
import { syncBrandBnaloLeads, } from "@/utils/integrations/syncLeads";

let isRunning = false;

export function startBrandBnaloSyncCron() {
    console.log("🚀 BrandBnalo lead sync cron started");

    cron.schedule("* * * * *", async () => {
        if (isRunning) {
            console.log("⏳ Previous BrandBnalo sync is still running");
            return;
        }

        isRunning = true;

        try {
            await connectDB();
            const integrations = await Integration.find({ provider: "website", status: "connected", })
                .select("userId provider status").lean();

            console.log(`🔄 BrandBnalo sync started for ${integrations.length} sellers`);

            if (integrations.length === 0) {
                // console.log("⚠️ No connected website integrations found");

                const allWebsiteIntegrations = await Integration.find({ provider: "website", })
                    .select("userId provider status").lean();

                // console.log("🌐 Website integrations in DB:", allWebsiteIntegrations);
                return;
            }

            for (const integration of integrations) {
                try {
                    if (!integration.userId) {
                        console.log("⚠️ Integration has no userId:", integration._id);

                        continue;
                    }

                    // console.log("👤 Syncing seller:", String(integration.userId));
                    const result = await syncBrandBnaloLeads(integration.userId);
                    console.log(`✅ Seller ${integration.userId}:`, result);
                } catch (error) {
                    console.error(`❌ Seller ${integration.userId} sync failed:`, error);
                }
            }
        } catch (error) {
            console.error(
                "❌ BrandBnalo cron error:",
                error
            );
        } finally {
            isRunning = false;
        }
    });
}
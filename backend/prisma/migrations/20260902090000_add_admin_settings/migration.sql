-- CreateTable
CREATE TABLE "admin_settings" (
    "id" TEXT NOT NULL DEFAULT 'admin',
    "passwordHash" TEXT NOT NULL,

    CONSTRAINT "admin_settings_pkey" PRIMARY KEY ("id")
);

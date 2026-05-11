-- CreateTable
CREATE TABLE "Car" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "pricePerDay" INTEGER NOT NULL,
    "zeroToHundred" TEXT NOT NULL,
    "topSpeed" INTEGER NOT NULL,
    "seats" INTEGER NOT NULL,
    "engine" TEXT NOT NULL DEFAULT 'Twin-Turbo V8',
    "transmission" TEXT NOT NULL DEFAULT 'Automatic',
    "colors" TEXT NOT NULL,
    "image" TEXT NOT NULL DEFAULT '/images/placeholder.jpg',
    "available" BOOLEAN NOT NULL DEFAULT true,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Reservation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "carId" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "customerEmail" TEXT NOT NULL,
    "customerPhone" TEXT NOT NULL,
    "pickupDate" DATETIME NOT NULL,
    "dropoffDate" DATETIME NOT NULL,
    "pickupLocation" TEXT NOT NULL DEFAULT 'Marrakesh Airport',
    "dropoffLocation" TEXT NOT NULL DEFAULT 'Marrakesh Airport',
    "insurance" BOOLEAN NOT NULL DEFAULT false,
    "chauffeur" BOOLEAN NOT NULL DEFAULT false,
    "childSeat" BOOLEAN NOT NULL DEFAULT false,
    "gps" BOOLEAN NOT NULL DEFAULT false,
    "totalPrice" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Reservation_carId_fkey" FOREIGN KEY ("carId") REFERENCES "Car" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "ContactMessage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "subject" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "Car_slug_key" ON "Car"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

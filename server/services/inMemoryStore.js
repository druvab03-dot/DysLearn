const bcrypt = require("bcryptjs");

// In-Memory Storage for Standalone / Demo mode
const memoryData = {
    parents: [],
    children: [],
    otps: [],
};

// Seed demo parent and child synchronously
const seedDemoData = () => {
    if (memoryData.parents.length === 0) {
        const hashedPassword = bcrypt.hashSync("Password123!", 10);
        const demoParentId = "66f1a2b3c4d5e6f7a8b9c0d1";
        const demoChildId = "66f1a2b3c4d5e6f7a8b9c0d2";

        const demoParent = {
            _id: demoParentId,
            fullName: "Priya Sharma",
            email: "parent@dyslearn.com",
            phone: "9876543210",
            password: hashedPassword,
            profilePhoto: "",
            children: [demoChildId],
            createdAt: new Date(),
            updatedAt: new Date(),
            matchPassword: async function (enteredPassword) {
                return await bcrypt.compare(enteredPassword, this.password);
            },
        };

        const demoChild = {
            _id: demoChildId,
            parent: demoParentId,
            name: "Aarav Sharma",
            class: "3",
            handwritingImage: "/uploads/handwriting/sample_aarav_handwriting.png",
            learningLevel: "average",
            handwritingAnalyzed: true,
            createdAt: new Date(),
            updatedAt: new Date(),
            save: async function () {
                this.updatedAt = new Date();
                return this;
            },
        };

        memoryData.parents.push(demoParent);
        memoryData.children.push(demoChild);
    }
};

seedDemoData();

const generateId = () => {
    return Math.random().toString(16).substring(2, 10) +
           Math.random().toString(16).substring(2, 10) +
           Math.random().toString(16).substring(2, 10);
};

const InMemoryParent = {
    async findOne(query) {
        seedDemoData();
        return memoryData.parents.find((p) => {
            if (query.email && p.email.toLowerCase() === String(query.email).toLowerCase()) return true;
            if (query.phone && p.phone === String(query.phone)) return true;
            if (query.$or) {
                return query.$or.some(
                    (cond) =>
                        (cond.email && p.email.toLowerCase() === String(cond.email).toLowerCase()) ||
                        (cond.phone && p.phone === String(cond.phone))
                );
            }
            return false;
        }) || null;
    },

    async findById(id) {
        seedDemoData();
        const p = memoryData.parents.find((item) => String(item._id) === String(id));
        if (!p) return null;
        return {
            ...p,
            select: () => {
                const { password, ...rest } = p;
                return rest;
            },
        };
    },

    async create(data) {
        const hashedPassword = await bcrypt.hash(data.password, 10);
        const newParent = {
            _id: generateId(),
            fullName: data.fullName,
            email: data.email.toLowerCase(),
            phone: data.phone,
            password: hashedPassword,
            profilePhoto: data.profilePhoto || "",
            children: [],
            createdAt: new Date(),
            updatedAt: new Date(),
            matchPassword: async function (enteredPassword) {
                return await bcrypt.compare(enteredPassword, this.password);
            },
            save: async function () {
                this.updatedAt = new Date();
                return this;
            },
        };
        memoryData.parents.push(newParent);
        return newParent;
    },

    async findByIdAndUpdate(id, update) {
        const p = memoryData.parents.find((item) => String(item._id) === String(id));
        if (!p) return null;
        if (update.$push && update.$push.children) {
            p.children.push(update.$push.children);
        }
        if (update.$pull && update.$pull.children) {
            p.children = p.children.filter((cId) => String(cId) !== String(update.$pull.children));
        }
        p.updatedAt = new Date();
        return p;
    },
};

const InMemoryChild = {
    async find(query) {
        seedDemoData();
        const results = memoryData.children.filter(
            (c) => String(c.parent) === String(query.parent)
        );
        return {
            sort: () => results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
        };
    },

    async findOne(query) {
        seedDemoData();
        const c = memoryData.children.find((item) => {
            const matchesId = !query._id || String(item._id) === String(query._id);
            const matchesParent = !query.parent || String(item.parent) === String(query.parent);
            return matchesId && matchesParent;
        });
        if (!c) return null;
        return {
            ...c,
            save: async function () {
                c.learningLevel = this.learningLevel;
                c.handwritingAnalyzed = this.handwritingAnalyzed;
                c.updatedAt = new Date();
                return c;
            },
        };
    },

    async create(data) {
        const newChild = {
            _id: generateId(),
            parent: data.parent,
            name: data.name,
            class: data.class || data.className || "",
            handwritingImage: data.handwritingImage,
            learningLevel: data.learningLevel || null,
            handwritingAnalyzed: data.handwritingAnalyzed || false,
            createdAt: new Date(),
            updatedAt: new Date(),
            save: async function () {
                this.updatedAt = new Date();
                return this;
            },
        };
        memoryData.children.push(newChild);
        return newChild;
    },

    async deleteOne(query) {
        const idx = memoryData.children.findIndex(
            (c) => String(c._id) === String(query._id)
        );
        if (idx !== -1) {
            memoryData.children.splice(idx, 1);
            return { deletedCount: 1 };
        }
        return { deletedCount: 0 };
    },
};

const InMemoryOtp = {
    async findOne(query) {
        return memoryData.otps.find((o) => {
            const matchesId = !query.identifier || o.identifier.toLowerCase() === query.identifier.toLowerCase();
            const matchesPurpose = !query.purpose || o.purpose === query.purpose;
            const matchesVerified = query.verified === undefined || o.verified === query.verified;
            return matchesId && matchesPurpose && matchesVerified;
        }) || null;
    },

    async create(data) {
        const newOtp = {
            _id: generateId(),
            identifier: data.identifier.toLowerCase(),
            otp: String(data.otp),
            purpose: data.purpose,
            verified: data.verified || false,
            expiresAt: data.expiresAt || new Date(Date.now() + 5 * 60 * 1000),
            createdAt: new Date(),
            save: async function () {
                return this;
            },
        };
        memoryData.otps.push(newOtp);
        return newOtp;
    },

    async deleteOne(query) {
        const idx = memoryData.otps.findIndex((o) => {
            if (query._id) return String(o._id) === String(query._id);
            if (query.identifier) return o.identifier.toLowerCase() === query.identifier.toLowerCase();
            return false;
        });
        if (idx !== -1) {
            memoryData.otps.splice(idx, 1);
            return { deletedCount: 1 };
        }
        return { deletedCount: 0 };
    },

    async deleteMany(query) {
        if (query.identifier && query.purpose) {
            memoryData.otps = memoryData.otps.filter(
                (o) => !(o.identifier.toLowerCase() === query.identifier.toLowerCase() && o.purpose === query.purpose)
            );
        } else if (query.$or) {
            memoryData.otps = memoryData.otps.filter((o) => {
                return !query.$or.some(
                    (cond) =>
                        cond.identifier.toLowerCase() === o.identifier.toLowerCase() &&
                        cond.purpose === o.purpose
                );
            });
        }
        return { acknowledged: true };
    },
};

module.exports = {
    InMemoryParent,
    InMemoryChild,
    InMemoryOtp,
};

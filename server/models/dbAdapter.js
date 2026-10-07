const mongoose = require("mongoose");
const MongooseParent = require("./Parent");
const MongooseChild = require("./Child");
const MongooseOtp = require("./Otp");
const { InMemoryParent, InMemoryChild, InMemoryOtp } = require("../services/inMemoryStore");

const isMongoConnected = () => {
    return mongoose.connection.readyState === 1;
};

const getParentModel = () => {
    return isMongoConnected() ? MongooseParent : InMemoryParent;
};

const getChildModel = () => {
    return isMongoConnected() ? MongooseChild : InMemoryChild;
};

const getOtpModel = () => {
    return isMongoConnected() ? MongooseOtp : InMemoryOtp;
};

const createModelProxy = (getModelFn) => {
    function ModelProxy(...args) {
        const RealModel = getModelFn();
        if (typeof RealModel === "function") {
            return new RealModel(...args);
        }
        return Object.create(RealModel);
    }

    return new Proxy(ModelProxy, {
        get(target, prop) {
            const real = getModelFn();
            const val = real[prop];
            if (typeof val === "function") {
                return val.bind(real);
            }
            return val;
        },
        set(target, prop, value) {
            const real = getModelFn();
            real[prop] = value;
            return true;
        },
        construct(target, args) {
            const RealModel = getModelFn();
            if (typeof RealModel === "function") {
                return new RealModel(...args);
            }
            return Object.create(RealModel);
        },
        apply(target, thisArg, args) {
            const RealModel = getModelFn();
            if (typeof RealModel === "function") {
                return RealModel.apply(thisArg, args);
            }
            return RealModel;
        },
    });
};

const ParentProxy = createModelProxy(getParentModel);
const ChildProxy = createModelProxy(getChildModel);
const OtpProxy = createModelProxy(getOtpModel);

module.exports = {
    Parent: ParentProxy,
    Child: ChildProxy,
    Otp: OtpProxy,
    getParentModel,
    getChildModel,
    getOtpModel,
    isMongoConnected,
};

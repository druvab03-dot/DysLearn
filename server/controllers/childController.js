const fs = require("fs");
const path = require("path");

const { Child, Parent } = require("../models/dbAdapter");

const {
    analyzeHandwriting,
} = require(
    "../services/handwritingAnalysisService"
);


// ==========================================
// DELETE IMAGE HELPER
// ==========================================

const deleteHandwritingImage = (
    imagePath
) => {

    if (!imagePath) return;


    const fullPath =
        path.join(
            __dirname,
            "..",
            imagePath
        );


    if (fs.existsSync(fullPath)) {

        fs.unlinkSync(fullPath);

    }

};


// ==========================================
// ADD CHILD
// POST /api/children
// ==========================================

const addChild = async (
    req,
    res
) => {

    try {

        const { name, class: childClass, className } = req.body;
        const selectedClass = (childClass || className || "").trim();


        if (!name?.trim()) {

            if (req.file) {

                fs.unlinkSync(
                    req.file.path
                );

            }


            return res
                .status(400)
                .json({

                    message:
                        "Child name is required",

                });

        }


        if (!req.file) {

            return res
                .status(400)
                .json({

                    message:
                        "Handwriting image is required",

                });

        }


        const handwritingImage =
            `/uploads/handwriting/${req.file.filename}`;


        const child =
            await Child.create({

                parent:
                    req.parent._id,

                name:
                    name.trim(),

                class:
                    selectedClass,

                handwritingImage,

            });


        await Parent.findByIdAndUpdate(

            req.parent._id,

            {
                $push: {
                    children:
                        child._id,
                },
            }

        );


        return res
            .status(201)
            .json({

                message:
                    "Child added successfully",

                child,

            });


    } catch (error) {

        console.error(
            "ADD CHILD ERROR:",
            error
        );


        if (req.file) {

            try {

                fs.unlinkSync(
                    req.file.path
                );

            } catch (
                deleteError
            ) {

                console.error(
                    "IMAGE CLEANUP ERROR:",
                    deleteError
                );

            }

        }


        return res
            .status(500)
            .json({

                message:
                    "Unable to add child",

            });

    }

};


// ==========================================
// ANALYZE HANDWRITING
// POST /api/children/:id/analyze
// ==========================================

const analyzeChildHandwriting = async (
    req,
    res
) => {

    try {

        const child =
            await Child.findOne({

                _id:
                    req.params.id,

                parent:
                    req.parent._id,

            });


        if (!child) {

            return res
                .status(404)
                .json({

                    message:
                        "Child not found",

                });

        }


        const imagePath =
            path.join(
                __dirname,
                "..",
                child.handwritingImage
            );


        const result =
            await analyzeHandwriting(
                imagePath
            );


        const learningLevelByCategory = {

            "Support Needed":
                "below-average",

            "Developing Well":
                "average",

            "Progressing Well":
                "above-average",

        };


        child.learningLevel =
            learningLevelByCategory[
                result.category
            ];

        child.handwritingAnalyzed = true;

        await child.save();


        return res
            .status(200)
            .json({

                message:
                    "Handwriting analysis complete",

                child,

                analysis: result,

            });


    } catch (error) {

        console.error(
            "HANDWRITING ANALYSIS ERROR:",
            error
        );


        return res
            .status(
                error.code ===
                "MODEL_NOT_READY"
                    ? 503
                    : 500
            )
            .json({

                message:
                    error.message ||
                    "Unable to analyze handwriting",

            });

    }

};


// ==========================================
// GET ALL CHILDREN
// GET /api/children
// ==========================================

const getChildren = async (
    req,
    res
) => {

    try {

        const children =
            await Child.find({

                parent:
                    req.parent._id,

            }).sort({

                createdAt: -1,

            });


        return res
            .status(200)
            .json({

                children,

            });


    } catch (error) {

        console.error(
            "GET CHILDREN ERROR:",
            error
        );


        return res
            .status(500)
            .json({

                message:
                    "Unable to fetch children",

            });

    }

};


// ==========================================
// GET SINGLE CHILD
// GET /api/children/:id
// ==========================================

const getChild = async (
    req,
    res
) => {

    try {

        const child =
            await Child.findOne({

                _id:
                    req.params.id,

                parent:
                    req.parent._id,

            });


        if (!child) {

            return res
                .status(404)
                .json({

                    message:
                        "Child not found",

                });

        }


        return res
            .status(200)
            .json({

                child,

            });


    } catch (error) {

        console.error(
            "GET CHILD ERROR:",
            error
        );


        return res
            .status(500)
            .json({

                message:
                    "Unable to fetch child",

            });

    }

};


// ==========================================
// DELETE CHILD
// DELETE /api/children/:id
// ==========================================

const deleteChild = async (
    req,
    res
) => {

    try {

        const child =
            await Child.findOne({

                _id:
                    req.params.id,

                parent:
                    req.parent._id,

            });


        if (!child) {

            return res
                .status(404)
                .json({

                    message:
                        "Child not found",

                });

        }


        deleteHandwritingImage(
            child.handwritingImage
        );


        await Child.deleteOne({

            _id:
                child._id,

        });


        await Parent.findByIdAndUpdate(

            req.parent._id,

            {
                $pull: {

                    children:
                        child._id,

                },
            }

        );


        return res
            .status(200)
            .json({

                message:
                    "Child removed successfully",

            });


    } catch (error) {

        console.error(
            "DELETE CHILD ERROR:",
            error
        );


        return res
            .status(500)
            .json({

                message:
                    "Unable to remove child",

            });

    }

};


module.exports = {

    addChild,

    getChildren,

    getChild,

    deleteChild,

    analyzeChildHandwriting,

};

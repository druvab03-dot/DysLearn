const fs = require("fs");
const path = require("path");

const Child = require("../models/Child");
const Parent = require("../models/Parent");
const AnalysisResult = require("../models/AnalysisResult");

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

        const { name, classNumber } = req.body;


        if (!name?.trim()) {

            return res
                .status(400)
                .json({

                    message:
                        "Child name is required",

                });

        }

        const parsedClass = parseInt(classNumber, 10);
        if (!parsedClass || parsedClass < 1 || parsedClass > 5) {
            return res
                .status(400)
                .json({
                    message: "Valid class number between 1 and 5 is required",
                });
        }


        const child =
            await Child.create({

                parent:
                    req.parent._id,

                name:
                    name.trim(),

                classNumber:
                    parsedClass,

                handwritingImage:
                    null,

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

        return res
            .status(500)
            .json({

                message:
                    "Unable to add child",

            });

    }

};


// ==========================================
// UPLOAD CHILD HANDWRITING PHOTO
// POST /api/children/:id/handwriting
// ==========================================

const uploadChildHandwriting = async (
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

            if (req.file) {
                fs.unlinkSync(req.file.path);
            }

            return res
                .status(404)
                .json({

                    message:
                        "Child not found",

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


        // Remove old handwriting image if one already existed
        if (child.handwritingImage) {
            deleteHandwritingImage(child.handwritingImage);
        }

        const handwritingImage =
            `/uploads/handwriting/${req.file.filename}`;

        child.handwritingImage = handwritingImage;
        await child.save();

        return res
            .status(200)
            .json({

                message:
                    "Handwriting sample uploaded successfully",

                child,

            });

    } catch (error) {

        console.error(
            "UPLOAD HANDWRITING ERROR:",
            error
        );

        if (req.file) {
            try {
                fs.unlinkSync(req.file.path);
            } catch (delErr) {
                console.error("Cleanup error:", delErr);
            }
        }

        return res
            .status(500)
            .json({

                message:
                    "Unable to upload handwriting sample",

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

        if (!child.handwritingImage) {
            return res
                .status(400)
                .json({
                    message: "Handwriting image is required",
                });
        }


        const imagePath =
            path.join(
                __dirname,
                "..",
                child.handwritingImage
            );

        if (!fs.existsSync(imagePath)) {
            return res
                .status(404)
                .json({
                    message: "Uploaded handwriting image file not found on server",
                });
        }


        const result =
            await analyzeHandwriting(
                imagePath,
                child.classNumber || 1
            );


        const learningLevelByCategory = {

            "Support needed":
                "below-average",

            "Developing":
                "average",

            "Progressing well":
                "above-average",

            "Support Needed":
                "below-average",

            "Developing Well":
                "average",

            "Progressing Well":
                "above-average",

        };


        // Persistently store analysis result associated with the student
        const analysisRecord = await AnalysisResult.create({
            child: child._id,
            parent: req.parent._id,
            uploadId: result.uploadId,
            classNumber: child.classNumber || 1,
            handwritingImage: child.handwritingImage,
            pdfUrl: result.pdfUrl,
            category: result.category,
            score: result.score,
            totalLetters: result.totalLetters,
            counts: result.counts,
            details: result.details,
            status: "completed",
        });

        child.learningLevel =
            learningLevelByCategory[
                result.category
            ] || "average";

        child.handwritingAnalyzed = true;
        child.analysisReportPdf = result.pdfUrl;
        child.latestAnalysis = analysisRecord._id;

        if (!Array.isArray(child.analysisResults)) {
            child.analysisResults = [];
        }
        child.analysisResults.push(analysisRecord._id);

        await child.save();


        return res
            .status(200)
            .json({

                message:
                    "Handwriting analysis complete",

                child,

                analysis: {
                    ...result,
                    _id: analysisRecord._id,
                    createdAt: analysisRecord.createdAt,
                },

            });


    } catch (error) {

        console.error(
            "HANDWRITING ANALYSIS ERROR:",
            error
        );


        return res
            .status(
                error.code ===
                "MODEL_NOT_READY" || error.code === "MODEL_UNAVAILABLE"
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

            })
            .populate("latestAnalysis")
            .sort({

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

            })
            .populate("latestAnalysis")
            .populate("analysisResults");


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


        // Remove associated persistent analysis records
        await AnalysisResult.deleteMany({
            child: child._id,
        });


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


// ==========================================
// GET CHILD ANALYSES HISTORY
// GET /api/children/:id/analyses
// ==========================================

const getChildAnalyses = async (
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


        const analyses =
            await AnalysisResult.find({

                child:
                    child._id,

                parent:
                    req.parent._id,

            }).sort({

                createdAt: -1,

            });


        return res
            .status(200)
            .json({

                childId:
                    child._id,

                childName:
                    child.name,

                analyses,

            });


    } catch (error) {

        console.error(
            "GET CHILD ANALYSES ERROR:",
            error
        );


        return res
            .status(500)
            .json({

                message:
                    "Unable to fetch analysis history",

            });

    }

};


// ==========================================
// GET LATEST CHILD ANALYSIS
// GET /api/children/:id/analysis
// ==========================================

const getLatestChildAnalysis = async (
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


        const analysis =
            await AnalysisResult.findOne({

                child:
                    child._id,

                parent:
                    req.parent._id,

            }).sort({

                createdAt: -1,

            });


        if (!analysis) {

            return res
                .status(404)
                .json({

                    message:
                        "No analysis found for this child",

                });

        }


        return res
            .status(200)
            .json({

                childId:
                    child._id,

                childName:
                    child.name,

                analysis,

            });


    } catch (error) {

        console.error(
            "GET LATEST CHILD ANALYSIS ERROR:",
            error
        );


        return res
            .status(500)
            .json({

                message:
                    "Unable to fetch analysis",

            });

    }

};


module.exports = {

    addChild,

    uploadChildHandwriting,

    getChildren,

    getChild,

    deleteChild,

    analyzeChildHandwriting,

    getChildAnalyses,

    getLatestChildAnalysis,

};

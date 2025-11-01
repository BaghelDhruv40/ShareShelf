import multer from "multer";

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(
			null,
			"D:/Dell ( D )/MyProgrammes/Web development/Project_12/Backend/static/public/"
		);
	},
	filename: function (req, file, cb) {
		cb(null, file.originalname);
	},
});

const upload = multer({ storage: storage });

export { upload };

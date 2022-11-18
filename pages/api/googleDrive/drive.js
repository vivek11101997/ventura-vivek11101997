const { google } = require('googleapis');
const fs = require('fs');

export default async function handler(req, response) {
    try{
    const DriveFileId = req.query.id;
    const APIKey = process.env.GOOGLE_DRIVE_API_KEY;

    const drive = google.drive({
        version: "v3",
        auth: APIKey
    });

    drive.files
        .get({ fileId: DriveFileId, alt: "media" }, { responseType: "stream" })
        .then((res) => {
            const dest = fs.createWriteStream("./public/temp_drive/" + DriveFileId+req.query.name);
            res.data
                .on("end", () => {
                    response.json({ data: `/temp_drive/${DriveFileId+req.query.name}`});
                })
                .on("error", (err) => {
                    response.json({ error: err })
                })
                .pipe(dest);
        })
        .catch((error) => {
            response.status(400);
            response.json({ error: "Allow permission to the file: Anyone with the link" })
        })
    }catch(e){
        response.status(400);
        response.json({ error: e })
    }
}
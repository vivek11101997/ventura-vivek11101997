const fs = require('fs');

export default async function handler(req, handleResponse) {
    try{
        fs.unlinkSync(req.query.path);
        handleResponse.json({ data: 'Success'});
    }catch(error){
        handleResponse.json({ error: error});
    }
}
const fs = require('fs');
const pool = require('./queries/DBPool');

const loadImages = async () => {

    const recettesResult = await pool.query(`SELECT recette_id FROM Recette`);

    recetteResult.rows.forEach(async row => {
        const recetteId = row.recette_id;
        const imageName = row.recette_id + '.jpg';
        const imageData = fs.readFileSync('./images/recettes/' + imageName);

        await pool.query(
            `UPDATE Recette SET image_content = $1, image_content_type = 'image/jpeg'
             WHERE recette_id = $2`,
            [imageData, recetteId]
        );
    });

};
loadImages();

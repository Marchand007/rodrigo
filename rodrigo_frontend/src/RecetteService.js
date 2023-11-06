import session from './session';

class ServiceError extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
    }
}

async function getResponseMessage(response) {
    try {
        const obj = await response.json();
        return obj.message ? obj.message : "Erreur inconnue";
    } catch (err) {
        return "" + err;
    }
}

async function createServiceError(response) {
    return new ServiceError(response.status, await getResponseMessage(response));
}

///***RECETTES***///

const convertToRecette = jsonRecette => {
    return {
        id: jsonRecette.id,
        nom: jsonRecette.nom,
        descCourt: jsonRecette.descCourt,
        descLong: jsonRecette.descLong,
        image: jsonRecette.image,
        tempsPrepMin: jsonRecette.tempsPrepMin,
        tempsCuissonMin: jsonRecette.tempsCuissonMin,
        nbPortions: jsonRecette.nbPortions
    };
};

export async function fetchRecettes() {
    const response = await fetch('/rodrigo-rodrigo-backend/recettes');

    if (response.ok) {
        const respJson = await response.json();
        return respJson.map(r => convertToRecette(r));
    } else {
        throw await createServiceError(response);
    }
}

export async function fetchRecette(recetteId) {
    const response = await fetch(`/rodrigo-rodrigo-backend/recettes/${recetteId}`);

    if (response.ok) {
        return convertToRecette(await response.json());
    } else {
        throw await createServiceError(response);
    }
};

export async function updateRecette(recette) {
    const response = await fetch(`/rodrigo-rodrigo-backend/recettes/${recette.id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            ...session.getAuthHeaders()
        },
        body: JSON.stringify(recette)
    });
    if (response.ok) {
        return response.json();
    } else {
        throw await createServiceError(response);
    }
}

export async function deleteRecetteById(recetteId) {
    const response = await fetch(`/rodrigo-rodrigo-backend/recettes/${recetteId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            ...session.getAuthHeaders()
        }
    });
    if (response.ok) {
        return response.json();
    } else {
        throw await createServiceError(response);
    }
}

export async function createRecette(recette) {
    const response = await fetch(`/rodrigo-rodrigo-backend/recettes`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...session.getAuthHeaders()
        },
        body: JSON.stringify(recette)
    });

    if (response.ok) {
        return response.json();
    } else {
        throw await createServiceError(response);
    }
}

export async function updateRecetteImage(recetteId, formData) {
    const response = await fetch(`/rodrigo-rodrigo-backend/recettes/${recetteId}/image`, {
        method: "POST",
        headers: {
            ...session.getAuthHeaders()
        },
        body: formData
    });

    if (response.ok) {
        return;
    } else {
        throw await createServiceError(response);
    }
}

///***ETAPES***///

export async function fetchEtapesByRecetteId(recetteId) {
    const response = await fetch(`/rodrigo-rodrigo-backend/etapes/${recetteId}`);

    if (response.ok) {
        return await response.json();
    } else {
        throw await createServiceError(response);
    }
}

export async function addEtape(etape) {
    const response = await fetch(`/rodrigo-rodrigo-backend/etapes`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...session.getAuthHeaders()
        },
        body: JSON.stringify(etape)
    });

    if (response.ok) {
        return response.json();
    } else {
        throw await createServiceError(response);
    }
}

///***INGREDIENTS***///

export async function fetchIngredientsByRecetteId(recetteId) {
    const response = await fetch(`/rodrigo-rodrigo-backend/ingredients/${recetteId}`);

    if (response.ok) {
        return await response.json();
    } else {
        throw await createServiceError(response);
    }
}

export async function addIngredient(ingredient) {
    const response = await fetch(`/rodrigo-rodrigo-backend/ingredients`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...session.getAuthHeaders()
        },
        body: JSON.stringify(ingredient)
    });

    if (response.ok) {
        return response.json();
    } else {
        throw await createServiceError(response);
    }
}

///***APPRECIATION***///

export async function fetchAppreciationByRecetteId(recetteId) {
    const response = await fetch(`/rodrigo-rodrigo-backend/appreciation/${recetteId}`);

    if (response.ok) {
        return await response.json();
    } else {
        throw await createServiceError(response);
    }
}

export async function fetchAppreciationForUserByRecetteId(recetteId) {
    const user = session.user_email;
    const response = await fetch(`/rodrigo-rodrigo-backend/appreciation/${recetteId}/${user}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            ...session.getAuthHeaders()
        }
    });

    if (response.ok) {
        return await response.json();
    } else {
        throw await createServiceError(response);
    }
}

export async function addAppreciationToRecipeId(appreciation) {
    const response = await fetch(`/rodrigo-rodrigo-backend/appreciation`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...session.getAuthHeaders()
        },
        body: JSON.stringify(appreciation)
    });

    if (response.ok) {
        return response.json();
    } else {
        throw await createServiceError(response);
    }
}

///***COMMENTAIRES***///

export async function fetchCommentairesByRecetteId(recetteId) {
    const response = await fetch(`/rodrigo-rodrigo-backend/comments/${recetteId}`);

    if (response.ok) {
        return await response.json();
    } else {
        throw await createServiceError(response);
    }
}

export async function addCommentaireToRecipeId(commentaire) {
    const response = await fetch(`/rodrigo-rodrigo-backend/comments`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...session.getAuthHeaders()
        },
        body: JSON.stringify(commentaire)
    });

    if (response.ok) {
        return response.json();
    } else {
        throw await createServiceError(response);
    }
}
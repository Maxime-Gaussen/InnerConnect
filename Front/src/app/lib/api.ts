const apiRoot = "http://localhost:5500/api";

export async function login(email: string, password: string) {

    const reponse = await fetch(apiRoot + "/session", {
        method: "POST",
        credentials: "include",
        headers: {
            'Content-Type': "application/json"
        },
        body: JSON.stringify({
            email: email,
            password: password
        })
    });
    const data = await reponse.json();

    return data;
}

export async function register(nom: string, prenom: string , age : string , email: string, password: string) {
    const reponse = await fetch(`${apiRoot}/user/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            nom: nom,
            prenom: prenom,
            age: age,
            email: email,
            password: password
        })
    });
    const data = await reponse.json();
    return data;

}

export async function getAllMethodologie() {
    const reponse = await fetch(apiRoot + "/methodologie/all/", {
        method: "GET",
        headers: { 'Content-Type': "application/json" }
    });
    return await reponse.json();
}

export async function getOnMethodo(methodoId: string) {
    const reponse = await fetch(apiRoot + "/methodologie/" + methodoId, {
        method: "GET",
        headers: { 'Content-Type': "application/json" }
    });
    return await reponse.json();
}

export async function getOneByProAndMethodo(id_pro : string , methodoId: string) {

    const reponse = await fetch(apiRoot + "/exercer/"+id_pro+"/" + methodoId, {
        method: "GET",
        credentials: "include",
        headers: {
            'Content-Type': "application/json"
        }
    });
    const data = await reponse.json();

    return data;
}

export async function getOneByPro(id_pro : string ) {

    const reponse = await fetch(apiRoot + "/exercer/"+id_pro , {
        method: "GET",
        credentials: "include",
        headers: {
            'Content-Type': "application/json"
        }
    });
    const data = await reponse.json();

    return data;

}

export async function updateExercer(update : string , id_pro : string , id_methodologie : string) {

    const reponse = await fetch(apiRoot + "/exercer/update/" + id_pro+"/"+id_methodologie, {
        method: "PUT",
        credentials: "include",
        headers: {
            'Content-Type': "application/json"
        },
        body: JSON.stringify({
            id_methodologie : update
        })
    });
    const data = await reponse.json();

    return data;

}


export async function addNewExercer(id_pro : string , id_methodologie: string) {
    const reponse = await fetch(`${apiRoot}/exercer/`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id_pro:  id_pro,
            id_methodologie: id_methodologie
        })
    });
    if (!reponse.ok) throw new Error(`Erreur serveur (${reponse.status})`);
    return await reponse.json();
}

export async function logout() {
    await fetch(apiRoot + "/session", {
        method: "DELETE",
        credentials: "include",
    });
}

export async function authByToken() {

    const reponse = await fetch(apiRoot + "/session/", {
        method: "GET",
        credentials: "include",
        headers: {
            'Content-Type': "application/json"
        }
    });
    const data = await reponse.json();
    return data;

}

export async function getUser(id: string) {

    const reponse = await fetch(apiRoot + "/user/" + id, {
        method: "GET",
        credentials: "include",
        headers: {
            'Content-Type': "application/json"
        }
    });
    const data = await reponse.json();

    return data;

}

export async function updateNameUser(update : string , id_user : string) {

    const reponse = await fetch(apiRoot + "/user/" + id_user, {
        method: "PUT",
        credentials: "include",
        headers: {
            'Content-Type': "application/json"
        },
        body: JSON.stringify({ 
            nom : update
        })
    });
    const data = await reponse.json();

    return data;

}
export async function updateFirstNameUser(update : string , id_user : string) {

    const reponse = await fetch(apiRoot + "/user/" + id_user, {
        method: "PUT",
        credentials: "include",
        headers: {
            'Content-Type': "application/json"
        },
        body: JSON.stringify({ 
            prenom : update
        })
    });
    const data = await reponse.json();

    return data;

}

export async function updateAgeUser(update : number , id_user : string) {

    const reponse = await fetch(apiRoot + "/user/" + id_user, {
        method: "PUT",
        credentials: "include",
        headers: {
            'Content-Type': "application/json"
        },
        body: JSON.stringify({ 
            age : update
        })
    });
    const data = await reponse.json();

    return data;

}

export async function updateEmailUser(update : string , id_user : string) {

    const reponse = await fetch(apiRoot + "/user/" + id_user, {
        method: "PUT",
        credentials: "include",
        headers: {
            'Content-Type': "application/json"
        },
        body: JSON.stringify({ 
            email : update
        })
    });
    const data = await reponse.json();

    return data;

    
}

export async function updatePasswordUser(update : string , id_user : string) {

    const reponse = await fetch(apiRoot + "/user/" + id_user, {
        method: "PUT",
        credentials: "include",
        headers: {
            'Content-Type': "application/json"
        },
        body: JSON.stringify({ 
            password : update
        })
    });
    const data = await reponse.json();

    return data;

}

export async function updateNameOffice(update: string, id_pro: string) {
    const reponse = await fetch(apiRoot + "/pro/" + id_pro, {
        method: "PUT",
        credentials: "include",
        headers: { 'Content-Type': "application/json" },
        body: JSON.stringify({ nom_cabinet: update })
    });
    return await reponse.json();
}

export async function updateAddressOffice(update: string, id_pro: string) {
    const reponse = await fetch(apiRoot + "/pro/" + id_pro, {
        method: "PUT",
        credentials: "include",
        headers: { 'Content-Type': "application/json" },
        body: JSON.stringify({ adresse: update })
    });
    return await reponse.json();
}

export async function updateCityOffice(update: string, id_pro: string) {
    const reponse = await fetch(apiRoot + "/pro/" + id_pro, {
        method: "PUT",
        credentials: "include",
        headers: { 'Content-Type': "application/json" },
        body: JSON.stringify({ ville: update })
    });
    return await reponse.json();
}

export async function updateDescriptionOffice(update: string, id_pro: string) {
    const reponse = await fetch(apiRoot + "/pro/" + id_pro, {
        method: "PUT",
        credentials: "include",
        headers: { 'Content-Type': "application/json" },
        body: JSON.stringify({ description: update })
    });
    return await reponse.json();
}

export async function updateOfficeHours(update: string, id_pro: string) {
    const reponse = await fetch(apiRoot + "/pro/" + id_pro, {
        method: "PUT",
        credentials: "include",
        headers: { 'Content-Type': "application/json" },
        body: JSON.stringify({ horaire_cabinet: update })
    });
    return await reponse.json();
}

export async function isPro(id_user: number) {
    const reponse = await fetch(apiRoot + "/pro/user/" + String(id_user), {
        method: "GET",
        credentials: "include",
        headers: { 'Content-Type': "application/json" }
    });
    const data = await reponse.json();
    return data;
}


export async function updateUser(id: string, nom: string, prenom: string, age: string, email: string) {

    const reponse = await fetch(apiRoot + "/user/" + id, {
        method: "PUT",
        credentials: "include",
        headers: {
            'Content-Type': "application/json"
        },
        body: JSON.stringify({ nom, prenom, age, email })
    });
    const data = await reponse.json();

    return data;

}

export async function searchProsByVille(id_methodologie: string, ville = '') {
    const params = new URLSearchParams({ id_methodologie });
    if (ville) params.set('ville', ville);
    const reponse = await fetch(`${apiRoot}/pro/search?${params}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });
    if (!reponse.ok) return [];
    return await reponse.json();
}

export async function verifyPro(identificationNationale: string) {

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const reponse = await fetch(apiRoot + "/pro/verify", {
        method: "POST",
        credentials: "include",
        signal: controller.signal,
        headers: {
            'Content-Type': "application/json"
        },
        body: JSON.stringify({ identificationNationale })
    });

    clearTimeout(timeout);

    if (!reponse.ok) {
        return { error: `Erreur serveur (${reponse.status})` };
    }

    const data = await reponse.json();

    return data;

}

export async function removeExercer(id_pro: string, id_methodologie: string) {
    const reponse = await fetch(`${apiRoot}/exercer/${id_pro}/${id_methodologie}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
    });
    if (!reponse.ok) throw new Error(`Erreur serveur (${reponse.status})`);
}

export async function registerPro(identificationNationale: string, id_user: number, nom_cabinet: string, adresse: string, ville: string, description: string, horaire_cabinet: string) {
    const reponse = await fetch(apiRoot + "/pro/register", {
        method: "POST",
        credentials: "include",
        headers: {
            'Content-Type': "application/json"
        },
        body: JSON.stringify({ identificationNationale, id_user, nom_cabinet, adresse, ville, description, horaire_cabinet })
    });

    if (!reponse.ok) {
        return { error: `Erreur serveur (${reponse.status})` };
    }

    const data = await reponse.json();

    return data;

}

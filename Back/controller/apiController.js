const OPENDATA_URL = "https://tabular-api.data.gouv.fr/api/resources/fffda7e9-0ea2-4c35-bba0-4496f3af935d/data/";

export async function findMedecinByIdentification(identificationNationale) {
    const url = new URL(OPENDATA_URL);
    url.searchParams.set("Identification nationale PP__exact", identificationNationale);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    try {
        const response = await fetch(url.toString(), { signal: controller.signal });
        clearTimeout(timeout);
        const data = await response.json();
        return data.data?.[0] || null;
    } catch (err) {
        clearTimeout(timeout);
        throw new Error("API externe inaccessible : " + err.message);
    }
}

export async function getMedecins(req, res) {
    const { identificationNationale, nom, prenom, exercice, profession, specialite } = req.query;

    const url = new URL(OPENDATA_URL);
    if (identificationNationale) url.searchParams.set("Identification nationale PP__exact", identificationNationale);
    if (nom) url.searchParams.set("Nom d'exercice__contains", nom);
    if (prenom) url.searchParams.set("Prénom d'exercice__contains", prenom);
    if (exercice) url.searchParams.set("Libellé mode exercice__contains", exercice);
    if (profession) url.searchParams.set("Libellé profession__contains", profession);
    if (specialite) url.searchParams.set("Libellé spécialité ordinale__contains", specialite);

    try {
        const response = await fetch(url.toString());
        const data = await response.json();
        const medecins = data.data
            .filter(row => row["Identification nationale PP"])
            .map(row => ({
                identificationNationale: row["Identification nationale PP"],
                nom: row["Nom d'exercice"],
                prenom: row["Prénom d'exercice"],
                profession: row["Libellé profession"],
                specialite: row["Libellé spécialité"],
            }));
        res.json(medecins);
    } catch {
        res.status(500).json({ error: "Erreur serveur" });
    }
}

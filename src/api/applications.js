const localStorageAPI = {
  key: "applications",

  fetchApplications() {
    const raw = localStorage.getItem(this.key);
    return raw ? JSON.parse(raw) : [];
  },

  postApplication(application) {
    const applications = this.fetchApplications();
    const newApp = { id: crypto.randomUUID(), ...application };
    applications.push(newApp);
    localStorage.setItem(this.key, JSON.stringify(applications));
    return newApp;
  },

  putApplication(id, updatedFields) {
    const applications = this.fetchApplications();
    const updated = applications.map((app) =>
      app.id === id ? { ...app, ...updatedFields } : app
    );
    localStorage.setItem(this.key, JSON.stringify(updated));
    return updated.find((app) => app.id === id);
  },

  deleteApplication(id) {
    const applications = this.fetchApplications();
    const filtered = applications.filter((app) => app.id !== id);
    localStorage.setItem(this.key, JSON.stringify(filtered));
  },
};

export default localStorageAPI;

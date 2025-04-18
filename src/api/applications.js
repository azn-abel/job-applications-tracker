const localStorageAPI = {
  key: "applications",

  fetchApplications() {
    const raw = localStorage.getItem(this.key);
    return raw ? JSON.parse(raw) : [];
  },

  postApplication(application) {
    const newApp = validateApplication(application);
    if (!newApp) return;

    const applications = this.fetchApplications();
    applications.push(newApp);
    localStorage.setItem(this.key, JSON.stringify(applications));
    return newApp;
  },

  putApplication(id, application) {
    const newApp = validateApplication({ id, ...application });
    if (!newApp) return;

    const applications = this.fetchApplications();
    const updated = applications.map((app) => (app.id === id ? newApp : app));
    localStorage.setItem(this.key, JSON.stringify(updated));
    return updated.find((app) => app.id === id);
  },

  deleteApplication(id) {
    const applications = this.fetchApplications();
    const filtered = applications.filter((app) => app.id !== id);
    localStorage.setItem(this.key, JSON.stringify(filtered));
  },
};

function validateApplication(application) {
  if (
    !application ||
    !application.jobTitle ||
    !application.company ||
    !application.status ||
    !application.applicationDate
  )
    return false;

  const { jobTitle, company, status, applicationDate } = application;

  const newApp = {
    id: application.id || crypto.randomUUID(),
    jobTitle,
    company,
    status,
    applicationDate,
    interviewDate:
      application.interviewDate && application.interviewDate !== "null"
        ? application.interviewDate
        : "",
    jobDescription:
      application.jobDescription && application.jobDescription !== "null"
        ? application.jobDescription
        : "",
  };

  return newApp;
}

export default localStorageAPI;

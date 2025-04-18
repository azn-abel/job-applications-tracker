import { useState, useEffect } from "react";
import { Flex } from "@mantine/core";
import localStorageAPI from "../api/applications";

import SankeyChart from "../components/SankeyChart/sankey";

export default function Visualize() {
  const [applications, setApplications] = useState(0);
  const [interviews, setInterviews] = useState(0);
  const [offers, setOffers] = useState(0);
  const [noResponse, setNoResponse] = useState(0);

  const [rejectionsNoInterview, setRejectionsNoInterview] = useState(0);
  const [applicationsNoResponse, setApplicationsNoResponse] = useState(0);
  const [interviewsNoResponse, setInterviewsNoResponse] = useState(0);
  const [interviewsRejected, setInterviewsRejected] = useState(0);

  useEffect(() => {
    const data = localStorageAPI.fetchApplications();

    const applicationCount = data.length;
    const interviewCount = data.filter(
      (item) =>
        ["Interview", "Offer"].includes(item.status) || item.interviewDate
    ).length;
    const offerCount = data.filter((item) => item.status === "Offer").length;
    const noResponseCount = data.filter((item) =>
      ["Interview", "New", "Assessment"].includes(item.status)
    ).length;
    const rejectionsNoInterviewCount = data.filter(
      (item) => !item.interviewDate && item.status === "Rejected"
    ).length;
    const applicationsNoResponseCount = data.filter((item) =>
      ["New", "Assessment"].includes(item.status)
    ).length;
    const interviewNoResponseCount = data.filter(
      (item) => item.status === "Interview"
    ).length;
    const interviewsRejectedCount = data.filter(
      (item) => item.status === "Rejected" && item.interviewDate
    ).length;

    setApplications(applicationCount);
    setInterviews(interviewCount);
    setOffers(offerCount);
    setNoResponse(noResponseCount);
    setRejectionsNoInterview(rejectionsNoInterviewCount);
    setApplicationsNoResponse(applicationsNoResponseCount);
    setInterviewsNoResponse(interviewNoResponseCount);
    setInterviewsRejected(interviewsRejectedCount);
  }, []);

  return (
    <Flex justify="center" align="start">
      <SankeyChart
        applications={applications}
        interviews={interviews}
        offers={offers}
        noResponse={noResponse}
        rejectionsNoInterview={rejectionsNoInterview}
        applicationsNoResponse={applicationsNoResponse}
        interviewsNoResponse={interviewsNoResponse}
        interviewsRejected={interviewsRejected}
      />
    </Flex>
  );
}

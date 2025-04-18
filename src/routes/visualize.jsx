import { useState, useEffect } from "react";
import { Flex, Title } from "@mantine/core";
import localStorageAPI from "../api/applications";

import SankeyChart from "../components/SankeyChart/sankey";

export default function Visualize() {
  const [loading, setLoading] = useState(true);

  const [applications, setApplications] = useState([]);
  const [interviews, setInterviews] = useState(0);
  const [offers, setOffers] = useState(0);
  const [noResponse, setNoResponse] = useState(0);

  const [rejectionsNoInterview, setRejectionsNoInterview] = useState(0);
  const [applicationsNoResponse, setApplicationsNoResponse] = useState(0);
  const [interviewsNoResponse, setInterviewsNoResponse] = useState(0);
  const [interviewsRejected, setInterviewsRejected] = useState(0);

  useEffect(() => {
    const data = localStorageAPI.fetchApplications();

    setApplications(data);
    setInterviews(
      data.filter(
        (item) =>
          ["Interview", "Offer"].includes(item.status) || item.interviewDate
      )
    );
    setOffers(data.filter((item) => item.status === "Offer"));
    setNoResponse(
      data.filter((item) =>
        ["Interview", "New", "Assessment"].includes(item.status)
      )
    );
    setRejectionsNoInterview(
      data.filter((item) => !item.interviewDate && item.status === "Rejected")
    );
    setApplicationsNoResponse(
      data.filter((item) => ["New", "Assessment"].includes(item.status))
    );
    setInterviewsNoResponse(data.filter((item) => item.status === "Interview"));
    setInterviewsRejected(
      data.filter((item) => item.status === "Rejected" && item.interviewDate)
    );

    setLoading(false);
  }, []);

  console.log(loading, applications);

  if (loading)
    return (
      <Flex justify="center" align="start">
        <Title order={2}>Loading...</Title>
      </Flex>
    );

  if (!loading && applications.length === 0) {
    return (
      <Flex justify="center" align="start">
        <Title order={2}>Nothing to show.</Title>
      </Flex>
    );
  }

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

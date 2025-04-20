import { useState, useEffect } from "react";
import { Flex, Title } from "@mantine/core";
import localStorageAPI from "../api/applications";

import SankeyChart from "../components/SankeyChart/sankey";

import { Application } from "../types/applications";

export default function Visualize() {
  const [loading, setLoading] = useState(true);

  const [applications, setApplications] = useState<Application[]>([]);
  const [interviews, setInterviews] = useState<Application[]>([]);
  const [offers, setOffers] = useState<Application[]>([]);
  const [noResponse, setNoResponse] = useState<Application[]>([]);

  const [rejectionsNoInterview, setRejectionsNoInterview] = useState<
    Application[]
  >([]);
  const [applicationsNoResponse, setApplicationsNoResponse] = useState<
    Application[]
  >([]);
  const [interviewsNoResponse, setInterviewsNoResponse] = useState<
    Application[]
  >([]);
  const [interviewsRejected, setInterviewsRejected] = useState<Application[]>(
    []
  );

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
        rejectionsNoInterview={rejectionsNoInterview}
        applicationsNoResponse={applicationsNoResponse}
        interviewsNoResponse={interviewsNoResponse}
        interviewsRejected={interviewsRejected}
      />
    </Flex>
  );
}

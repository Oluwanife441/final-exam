import { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";
import { Filter } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import Error from "@/components/error";

import useFetch from "@/hooks/use-fetch";

import { getUrls } from "@/db/apiUrls";
import { getClicksForUrls } from "@/db/apiClicks";
import { useUrlContext } from "@/context";
import LinkCard from "@/components/link-card";
import { CreateLink } from "@/components/create-link";

interface Url {
  id: string;
  qr: string;
  title: string;
  custom_url?: string;
  short_url: string;
  original_url: string;
  created_at: string;
}

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useUrlContext();

  const {
    loading,
    error,
    data: urls,
    fn: fnUrls,
  } = useFetch(getUrls, user?.id);

  const {
    loading: loadingClicks,
    data: clicks,
    fn: fnClicks,
  } = useFetch(
    getClicksForUrls,
    urls?.map((url: Url) => url.id)
  );

  useEffect(() => {
    if (user?.id) {
      console.log("Fetching URLs for user:", user.id);
      fnUrls();
    }
  }, [user?.id]);

  const filteredUrls = urls?.filter((url: Url) =>
    url.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    if (urls?.length) {
      console.log("Fetching clicks for URLs:", urls);
      fnClicks();
    }
  }, [urls]);

  return (
    <div className="flex flex-col gap-8">
      {(loading || loadingClicks) && (
        <BarLoader width={"100%"} color="#36d7b7" />
      )}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Links Created</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{urls?.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Clicks</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{clicks?.length}</p>
          </CardContent>
        </Card>
      </div>
      <div className="flex justify-between">
        <h1 className="text-4xl font-extrabold">My Links</h1>
        <CreateLink />
      </div>
      <div className="relative">
        <Input
          type="text"
          placeholder="Filter Links..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Filter className="absolute top-2 right-2 p-1" />
      </div>
      {error && <Error message={error?.message} />}
      {(filteredUrls || []).map((url: Url, i: number) => (
        <LinkCard key={i} url={url} fetchUrls={fnUrls} />
      ))}
    </div>
  );
};

export default Dashboard;

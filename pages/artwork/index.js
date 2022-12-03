import validObjectIDList from "../../public/data/validObjectIDList.json";

import { useRouter } from "next/router";
import Error from "next/error";
import { useState, useEffect } from "react";
import { Row, Col, Pagination, Card } from "react-bootstrap";
import ArtworkCard from "../../components/ArtworkCard";
import useSWR from "swr";
let PER_PAGE = 12;
const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function Artwork() {
  const router = useRouter();
  let finalQuery = router.asPath.split("?")[1];
  const [artworkList, setArtworkList] = useState([]);
  const [page, setPage] = useState(1);

  const { data, error } = useSWR(
    `https://collectionapi.metmuseum.org/public/collection/v1/search?${finalQuery}`,
    fetcher
  );

  useEffect(() => {
    if (data) {
      let results = [];
      let filteredResults = validObjectIDList.objectIDs.filter((x) =>
        data.objectIDs?.includes(x)
      );

      for (let i = 0; i < filteredResults.length; i += PER_PAGE) {
        const chunk = filteredResults.slice(i, i + PER_PAGE);
        results.push(chunk);
      }
      setArtworkList(results);
      setPage(1);
    }
  }, [data]);

  if (error) return <Error statusCode={404} />;

  if (!data) return <div>loading...</div>;

  function previousPage() {
    if (page > 1) {
      setPage((pageVal) => pageVal - 1);
    }
  }
  function nextPage() {
    if (page < artworkList.length) {
      setPage((pageVal) => pageVal + 1);
    }
  }
  return (
    <>
      <Row className="gy-4">
        {artworkList.length == 0 ? (
          <Card>
            <h4>Nothing Here</h4>{" "}
          </Card>
        ) : (
          artworkList[page - 1]?.map((objectIDs) => (
            <Col lg={3} key={objectIDs}>
              <ArtworkCard objectID={objectIDs} />
            </Col>
          ))
        )}
      </Row>
      {artworkList.length > 1 ? (
        <Pagination>
          <Pagination.Prev onClick={previousPage} />
          <Pagination.Item>{page}</Pagination.Item>
          <Pagination.Next onClick={nextPage} />
        </Pagination>
      ) : null}
    </>
  );
}

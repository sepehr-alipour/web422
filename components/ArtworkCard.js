import { Card, Button } from "react-bootstrap";
import Error from "next/error";
import Link from "next/link";
import useSWR from "swr";
const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function ArtworkCard(result) {
  const { data, error } = useSWR(
    `https://collectionapi.metmuseum.org/public/collection/v1/objects/${result.objectID}`,
    fetcher
  );

  if (error) return <Error statusCode={404} />;
  if (!data) return <div>loading...</div>;

  return (
    <>
      <Card>
        <Card.Img
          variant="top"
          src={
            data.primaryImageSmall
              ? data.primaryImageSmall
              : "https://via.placeholder.com/375x375.png?text=[+Not+Available+]"
          }
        />
        <Card.Body>
          <Card.Title>{data.title ? data.title : "N/A"}</Card.Title>
          <Card.Text>
            {" "}
            <strong>Date: </strong>
            {data.objectDate ? data.objectDate : "N/A"}
          </Card.Text>
          <Card.Text>
            {" "}
            <strong>Classification: </strong>
            {data.classification ? data.classification : "N/A"}
          </Card.Text>
          <Card.Text>
            <strong>Medium: </strong>
            {data.medium ? data.medium : "N/A"}
          </Card.Text>
          <br />
          <Link href={`/artwork/${data.objectID}`} passHref>
            <Button variant="primary">ID: {data.objectID}</Button>
          </Link>
        </Card.Body>
      </Card>
    </>
  );
}

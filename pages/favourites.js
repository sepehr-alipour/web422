import { useAtom } from "jotai";
import { atom } from "jotai";

import { favouritesAtom } from "../store";

import { useRouter } from "next/router";
import Error from "next/error";
import { useState, useEffect } from "react";
import { Row, Col, Card } from "react-bootstrap";
import ArtworkCard from "../components/ArtworkCard";

export default function Favorites() {
  const router = useRouter();
  let finalQuery = router.asPath.split("?")[1];
  const [favouritesList, setFavouritesList] = useAtom(favouritesAtom);

  if (!favouritesList) return null; 

  return (
    <>
      <Row className="gy-4">
        {favouritesList.length == 0 ? (
          <Card>
            <h4>Nothing Here</h4>
          </Card>
        ) : (

          favouritesList.map((objectIDs) => (
            <Col lg={3} key={objectIDs}>
              <ArtworkCard objectID={objectIDs} />
            </Col>
          ))
        )}
      </Row>
    </>
  );
}

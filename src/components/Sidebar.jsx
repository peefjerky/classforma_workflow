import React, { useEffect, useState } from "react";
import "../scss/WorkflowDesigner.scss";
import { Pagination, Container, Row, Col, Button } from "react-bootstrap";
import axios from "axios";
import { useQuery, useQueryClient } from "react-query";

const Sidebar = (props) => {
  const [pageCount, setPageCount] = useState(1);
  const [hasInput, setHasInput] = useState(false);

  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery(
    ["workflow", pageCount],
    async () => {
      const response = await axios.get(
        `https://64307b10d4518cfb0e50e555.mockapi.io/modules?page=${pageCount}&limit=5`
      );
      return response.data;
    }
    /* { staleTime: 1000 } */
  );

  if (isLoading) return <div>Loading...</div>;

  if (error) return <div>An error occurred: {error.message}</div>;

  if (pageCount <= 0) {
    setPageCount(1);
  }

  /*  console.log(data.map((item) => item.name)); */
  /*   const handleDragStart = (event, itemList) => {
    const jsonString = JSON.stringify(itemList);
    event.dataTransfer.setData("application/reactflow", jsonString);
  }; */
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData(
      "application/reactflow",
      JSON.stringify(nodeType)
    );
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <aside>
      <Container>
        <Row>
          <Col lg={12} md={12} sm={12} xs={12}>
            <div className="description">
              <h3>Workflows:</h3>
            </div>
          </Col>
          {/*    <Col lg={12} md={12} sm={12} xs={12}>
            <div
              className="dndnode input"
              onDragStart={(event) => onDragStart(event, "inputnode")}
              draggable
            >
              Input Node
            </div>
          </Col> */}
          <Col lg={12} md={12} sm={12} xs={12}>
            {data.map((item) => (
              <div
                key={item.id}
                className="dndnode"
                onDragStart={(event) =>
                  onDragStart(event, {
                    input_type: item.input_type.toUpperCase(),
                    output_type: item.output_type.toUpperCase(),
                    name: item.name,
                    type: "default",
                  })
                }
                draggable
              >
                <div>
                  {item.input_type.toUpperCase()} {item.name}{" "}
                  {item.output_type.toUpperCase()}
                </div>
              </div>
            ))}
          </Col>
          {/*  <Col lg={12} md={12} sm={12} xs={12}>
            <div
              className="dndnode output"
              onDragStart={(event) => onDragStart(event, "output")}
              draggable
            >
              Output Node
            </div>
          </Col> */}
          <Col lg={12} md={12} sm={12} xs={12}>
            <span>
              <Button onClick={() => setPageCount(pageCount - 1)}>
                Previous
              </Button>
              <span className="mx-2">{pageCount} </span>
              <Button onClick={() => setPageCount(pageCount + 1)}>Next</Button>
            </span>

            {/*  <Pagination>
              {[...Array(20)].map((_, index) => (
                <Pagination.Item
                  key={index}
                  active={index + 1 === currentPage}
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </Pagination.Item>
              ))}
            </Pagination> */}
          </Col>
        </Row>

        {/*   <Container className="my-5 mx-auto text-lg-center text-md-center text-sm-center ">
        <div className="mx-auto">
          <Pagination size="sm">
            <Pagination.Prev />
            <Pagination.Item>{1}</Pagination.Item>
            <Pagination.Item>{2}</Pagination.Item>
            <Pagination.Item>{3}</Pagination.Item>
            <Pagination.Item>{4}</Pagination.Item>
            <Pagination.Ellipsis />
            <Pagination.Next />
          </Pagination>
        </div>
      </Container> */}
      </Container>
    </aside>
  );
};

export default Sidebar;

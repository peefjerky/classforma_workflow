import React from "react";
import axios from "axios";
import { useQuery, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import DnDFlow from "../components/ReactFlow.jsx";
import "reactflow/dist/style.css";
import "../scss/WorkflowDesigner.scss";

const WorkflowDesigner = (props) => {
  const { id } = useParams();

  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery("workflow", async () => {
    const response = await axios.get(
      `https://64307b10d4518cfb0e50e555.mockapi.io/workflow/${id}`
    );
    return response.data;
  });

  if (isLoading) return <div>Loading...</div>;

  if (error) return <div>An error occurred: {error.message}</div>;
  /* console.log(data.createdAt); */

  return (
    <>
      <Container fluid className="py-2" id="Header">
        <Row className="text-lg-start text-sm-start text-start">
          <Col lg={12} md={12} sm={12}>
            <div className="workflowdesigner_header ps-3">
              <h2 className="text-primary">Workflow Name:</h2>
              <h3 className="text-secondary">{data.name}</h3>
            </div>
          </Col>
          <Col lg={12} md={12} sm={12}>
            <DnDFlow inputData={data} />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default WorkflowDesigner;

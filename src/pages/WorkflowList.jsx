import React, { useState, useEffect } from "react";
import axios from "axios";
import { useQuery, useQueryClient } from "react-query";

import { Row, Col, Container, Table } from "react-bootstrap";
import { Route, Routes, useLocation, Link as RLink } from "react-router-dom";
import "../scss/WorkflowList.scss";
import { Button } from "bootstrap";
import WorkflowDesigner from "./WorkflowDesigner";

const WorkflowList = (props) => {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery("workflow", async () => {
    const response = await axios.get(
      "https://64307b10d4518cfb0e50e555.mockapi.io/workflow"
    );
    return response.data;
  });

  if (isLoading) return <div>Loading...</div>;

  if (error) return <div>An error occurred: {error.message}</div>;
  /* console.log(data.map((item) => item.id)); */
  return (
    <>
      <header>
        <Container fluid className="py-2" id="Header">
          <Row className="text-lg-start text-sm-start text-start">
            <Col lg={12} md={12} sm={12}>
              <div className="workflow_header ps-3">
                <h3 className="text-primary">Workflows</h3>
              </div>
            </Col>
            <Col className="mt-5" lg={12} md={12} sm={12}>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Input Type</th>
                    <th>Created at</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <RLink
                          to={{
                            pathname: `/workflow-designer/${item.id}`,
                            state: { id: item.id, name: item.name },
                          }}
                        >
                          {item.name}
                        </RLink>
                      </td>
                      <td>{item.input_type.toUpperCase()}</td>
                      <td>
                        {new Date(item.createdAt).toISOString().slice(0, 10)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Col>
          </Row>
        </Container>
      </header>
      {/*  <Routes>
        <Route path="/workflow-designer" element={<WorkflowDesigner />} />
      </Routes> */}
    </>
  );
};
export default WorkflowList;

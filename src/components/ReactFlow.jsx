import React, { useState, useRef, useCallback } from "react";
import Sidebar from "./Sidebar";
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
} from "react-flow-renderer";
/* import { useNodesState } from "reactflow"; */
import "reactflow/dist/style.css";
import "../scss/WorkflowDesigner.scss";

/* const GetData = () => {
  const { i_id } = useParams();

  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery(
    "workflow",
    async () => {
      const response = await axios.get(
        `https://64307b10d4518cfb0e50e555.mockapi.io/workflow/${i_id}`
      );
      return response.data;
    },
    { staleTime: 1000 }
  );

  if (isLoading) return <div>Loading...</div>;

  if (error) return <div>An error occurred: {error.message}</div>;
};
 */
let idd = 0;
const getId = () => `dndnode_${idd++}`;

const DnDFlow = (props) => {
  const { createdAt, name, input_type, id } = props.inputData;
  /* console.log(props.inputData); */
  const initialNodes = [
    {
      id: props.inputData.id,
      /* id: getId(), */
      type: "input",
      /* data: { label: "input node" }, */
      data: {
        label: `${props.inputData.name} ${props.inputData.input_type}`,
        input_type: props.inputData.input_type,
      },
      position: { x: 250, y: 5 },
    },
  ];

  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const type = event.dataTransfer.getData("application/reactflow");
      const parsedType = JSON.parse(type);
      console.log(JSON.parse(type));
      console.log(parsedType.input_type);
      /* const nodeDataParsed = JSON.parse(type); */

      // check if the dropped element is valid
      if (typeof type === "undefined" || !type) {
        return;
      }

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const newNode = {
        id: getId(),
        type: "default",
        position: { x: 250, y: 5 },
        data: {
          label: `${parsedType.input_type} ${parsedType.name} ${parsedType.output_type}`,
          /*  label: `${type}`, */
          /* input_edge: nodeDataParsed.input_type,
          output_edge: nodeDataParsed.output_type, */
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance]
  );

  const defaultNodes = nodes.filter((node) => node.type === "default");
  const nodesWithNoInput = defaultNodes.filter((node) => {
    const inputEdges = edges.filter((edge) => edge.target === node.id);
    return inputEdges.length === 0;
  });

  const nodesWithNoInputIds = nodesWithNoInput.map((node) => node.id);
  const updatedNodes = nodes.map((node) => {
    if (node.type === "default" && nodesWithNoInputIds.includes(node.id)) {
      return {
        ...node,
        style: {
          border: "1px solid red",
          backgroundColor: "lightcoral",
        },
        key: node.id, // add a unique key prop
      };
    } else if (node.type === "input") {
      return {
        ...node,
        key: props.inputData.id, // add a unique key prop
      };
    } else {
      return {
        ...node,
        key: getId(), // add a unique key prop
      };
    }
  });
  console.log(props.inputData.id);

  return (
    <div className="dndflow" key={props.inputData.id}>
      <Sidebar />
      <ReactFlowProvider>
        <div className="reactflow-wrapper" ref={reactFlowWrapper}>
          <ReactFlow
            /* nodeTypes={nodeTypes} */
            /* nodes={nodes} */
            nodes={updatedNodes}
            /* nodeTypes={{
              default: { className: getNodeClassName },
            }} */
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            fitView
          >
            <Controls />
          </ReactFlow>
        </div>
      </ReactFlowProvider>
    </div>
  );
};

export default DnDFlow;

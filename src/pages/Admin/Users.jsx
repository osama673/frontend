import React, { useCallback, useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { format } from "date-fns";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { Modal, message, Table } from "antd";
const { confirm } = Modal;
function Users() {
  const [messageApi, contextHolder] = message.useMessage();
  const token = useSelector((state) => state.currentUser.token);
  const [data, setData] = useState([]);

  const getData = useCallback(async () => {
    const response = await axios.get("http://localhost:5000/api/admin/users", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const dataArray = Array.isArray(response.data.data)
      ? response.data.data
      : [];
    const data = dataArray.map((user) => {
      return {
        key: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        dateOfCreate: user.createdAt,
      };
    });
    setData(data);
  }, [token]);

  const showDeleteUserConfirm = useCallback(
    (id, name) => {
      confirm({
        title: "Are you sure delete this user?",
        icon: <ExclamationCircleFilled />,
        content: `You are going to delete ${name}!`,
        okText: "Yes",
        okType: "danger",
        cancelText: "No",
        async onOk() {
          await axios.delete("http://localhost:5000/api/admin/delte" + id, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          getData();
          messageApi.open({
            type: "success",
            content: "User has been deleted successfully",
          });
        },
        onCancel() {},
      });
    },
    [token, messageApi, getData]
  );

  const columns = useMemo(() => {
    return [
      {
        title: "First Name",
        dataIndex: "firstName",
        key: "firstName",
        render: (firstName) => <strong>{firstName}</strong>,
        width: 200,
      },
      {
        title: "Last Name",
        dataIndex: "lastName",
        key: "lastName",
        render: (lastName) => <strong>{lastName}</strong>,
        width: 200,
      },
      {
        title: "Email",
        dataIndex: "email",
        key: "email",
      },
      {
        title: "Date of creation",
        dataIndex: "dateOfCreate",
        key: "dateOfCreate",
        render: (date) => <>{format(date, "yyyy-MM-dd HH:mm")}</>,
        width: 300,
      },
      // {
      //   title: "Action",
      //   key: "action",
      //   width: 100,
      //   render: (_, record) => (
      //     <Space size="middle">
      //       <DeleteOutlined
      //         className="text-[red] cursor-pointer"
      //         onClick={() =>
      //           showDeleteUserConfirm(
      //             record.key,
      //             record.firstName + " " + record.lastName
      //           )
      //         }
      //       />
      //     </Space>
      //   ),
      // },
    ];
  }, []);

  useEffect(() => {
    getData();
  }, [getData]);

  return (
    <div>
      {contextHolder}
      <div className="flex flex-1 justify-center pt-4">
        <Table columns={columns} dataSource={data} />
      </div>
    </div>
  );
}

export default Users;

import React, { useMemo, useCallback, useEffect, useState } from "react";
import { Tag, Space, Modal, message, Table, Button } from "antd";
import {
  DeleteOutlined,
  ExclamationCircleFilled,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import axios from "axios";
import { format } from "date-fns";

const { confirm } = Modal;
function Dashboard() {
  const token = useSelector((state) => state.currentUser.token);
  const currentUser = useSelector((state) => state.currentUser.user);
  const [data, setData] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();

  const getData = useCallback(async () => {
    const response = await axios.get(
      process.env.REACT_APP_API_URL +
        "/api/user/my-reservations/" +
        currentUser?.id,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = response.data.map((reservation) => {
      return {
        key: reservation._id,
        title: reservation.book.title,
        category: reservation.book.category,
        dateOfReservation: reservation.dateOfReservation,
        dateOfReturn: reservation.dateOfReturn,
        isConfirmed: reservation.isConfirmed,
        isReturned: reservation.isReturned,
      };
    });
    setData(data);
  }, [token, currentUser]);

  const showDeleteReservationConfirm = useCallback(
    (id) => {
      confirm({
        title: "Are you sure delete this reservation?",
        icon: <ExclamationCircleFilled />,
        content: "",
        okText: "Yes",
        okType: "danger",
        cancelText: "No",
        async onOk() {
          await axios.delete(
            process.env.REACT_APP_API_URL + "/reservation/" + id,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          getData();
          messageApi.open({
            type: "success",
            content: "Your book has been deleted successfully",
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
        title: "Title",
        dataIndex: "title",
        key: "title",
        render: (title) => <strong>{title}</strong>,
        width: 200,
      },
      {
        title: "Category",
        dataIndex: "category",
        key: "category",
        render: (category) => <Tag color="green">{category.toUpperCase()}</Tag>,
      },
      {
        title: "Date of reservation",
        dataIndex: "dateOfReservation",
        key: "dateOfReservation",
        render: (date) => <>{format(date, "yyyy-MM-dd HH:mm")}</>,
        width: 300,
      },
      {
        title: "Date of return",
        dataIndex: "dateOfReturn",
        key: "dateOfReturn",
        render: (value) => (
          <>{value ? format(value, "yyyy-MM-dd") : "No Date"}</>
        ),
        width: 300,
      },
      {
        title: "Confirmation",
        dataIndex: "isConfirmed",
        key: "isConfirmed",
        render: (isConfirmed) => {
          return (
            <div className="flex justify-center items-center">
              {isConfirmed ? (
                <CheckCircleOutlined className="text-[green]" />
              ) : (
                <CloseCircleOutlined className="text-[red]" />
              )}
            </div>
          );
        },
        width: 300,
      },
      {
        title: "Retruned",
        dataIndex: "isReturned",
        key: "isReturned",
        render: (isReturned) => {
          return (
            <div className="flex justify-center items-center">
              {isReturned ? (
                <CheckCircleOutlined className="text-[green]" />
              ) : (
                <CloseCircleOutlined className="text-[red]" />
              )}
            </div>
          );
        },
        width: 300,
      },
      {
        title: "Action",
        key: "action",
        width: 100,
        render: (_, record) => (
          <Space size="middle">
            <Button
              type="text"
              shape="circle"
              disabled={record.isConfirmed}
              onClick={() => showDeleteReservationConfirm(record.key)}
              icon={
                <DeleteOutlined
                  className={`cursor-pointer ${
                    !record.isConfirmed && "text-[red]"
                  }`}
                />
              }
            />
          </Space>
        ),
      },
    ];
  }, [showDeleteReservationConfirm]);

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

export default Dashboard;

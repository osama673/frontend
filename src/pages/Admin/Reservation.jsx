import React, { useState, useCallback, useEffect, useMemo } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { format } from "date-fns";
import { Tag, Space, Modal, message, Table, Button, DatePicker } from "antd";
import {
  DeleteOutlined,
  ExclamationCircleFilled,
  CheckCircleOutlined,
  CloseCircleOutlined,
  EditOutlined,
  MinusSquareOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

const { confirm } = Modal;
function Reservation() {
  const token = useSelector((state) => state.currentUser.token);
  const [messageApi, contextHolder] = message.useMessage();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editReservation, setEditReservation] = useState(null);
  const [dateOfReturn, setDateOfReturn] = useState(null);

  const [data, setData] = useState([]);

  const getData = useCallback(async () => {
    const response = await axios.get(
      "http://localhost:5000/api/admin/reservations",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = response.data.data.map((reservation) => {
      return {
        key: reservation._id,
        title: reservation.book?.title ?? "no title",
        category: reservation.book?.category ?? "no category",
        dateOfReservation: reservation.dateOfReservation,
        dateOfReturn: reservation.dateOfReturn,
        isConfirmed: reservation.isConfirmed,
        isReturned: reservation.isReturned,
      };
    });
    setData(data);
  }, [token]);

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

  const onEdit = useCallback(async () => {
    await axios.put(
      process.env.REACT_APP_API_URL +
        "/reservation/confirmed/" +
        editReservation.key,
      {
        dateOfReturn: dateOfReturn,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    getData();
    setIsEditModalOpen(false);
  }, [editReservation, token, getData, dateOfReturn]);

  const handleEditModalCancel = useCallback(() => {
    setIsEditModalOpen(false);
    setDateOfReturn(null);
  }, []);

  const showIsReturnedReservation = useCallback(
    (id) => {
      confirm({
        title: "Are you sure if this book has been returned?",
        icon: <ExclamationCircleFilled />,
        content: "",
        okText: "Yes",
        okType: "text",
        cancelText: "No",
        async onOk() {
          await axios.get(
            process.env.REACT_APP_API_URL + "/reservation/returned/" + id,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          getData();
          messageApi.open({
            type: "success",
            content: "Your book has been return successfully",
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
        render: (date) => <>{format(date, "yyyy-MM-dd")}</>,
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
            <div className="flex justify-start items-center">
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
            <div className="flex justify-start items-center">
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
              disabled={record.isConfirmed && record.isReturned}
              onClick={() => {
                setEditReservation(record);
                record.dateOfReturn &&
                  setDateOfReturn(dayjs(record.dateOfReturn, "YYYY-MM-DD"));
                setIsEditModalOpen(true);
              }}
              icon={
                <EditOutlined
                  className={`cursor-pointer ${
                    (!record.isConfirmed || !record.isReturned) && "text-[blue]"
                  }`}
                />
              }
            />
            <Button
              type="text"
              shape="circle"
              disabled={record.isConfirmed && record.isReturned}
              onClick={() => showIsReturnedReservation(record.key)}
              icon={
                <MinusSquareOutlined
                  className={`cursor-pointer ${
                    (!record.isConfirmed || !record.isReturned) && "text-[blue]"
                  }`}
                />
              }
            />

            <Button
              type="text"
              shape="circle"
              onClick={() => showDeleteReservationConfirm(record.key)}
              icon={<DeleteOutlined className="text-[red] cursor-pointer" />}
            />
          </Space>
        ),
      },
    ];
  }, [
    showDeleteReservationConfirm,
    setEditReservation,
    showIsReturnedReservation,
  ]);

  useEffect(() => {
    getData();
  }, [getData]);

  const disabledDate = (current) => {
    // Can not select days before today and today
    return current && current < dayjs().endOf("day");
  };

  return (
    <div>
      {contextHolder}
      <div className="flex flex-1 justify-center pt-4">
        <Table columns={columns} dataSource={data} />
      </div>

      <Modal
        title="Edit Reservation"
        open={isEditModalOpen}
        onOk={onEdit}
        onCancel={handleEditModalCancel}
        footer={[
          <Button key="back" onClick={handleEditModalCancel}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={onEdit}
            disabled={!dateOfReturn}
            htmlType="submit"
            className="bg-[#34abeb]"
          >
            Edit
          </Button>,
        ]}
      >
        <div className="space-x-4">
          <strong> Date of return :</strong>
          <DatePicker
            format="YYYY-MM-DD"
            disabledDate={disabledDate}
            value={dateOfReturn}
            onChange={(e) => setDateOfReturn(e)}
          />
        </div>
      </Modal>
    </div>
  );
}
export default Reservation;

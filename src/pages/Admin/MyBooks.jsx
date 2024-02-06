import React, {
  useState,
  useCallback,
  useEffect,
  useRef,
  useMemo,
} from "react";
import { PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Modal,
  Form,
  Input,
  Select,
  Checkbox,
  message,
  Table,
  Tag,
  Space,
} from "antd";
import UploadWidget from "../../components/Upload/UploadWidget";
import { useSelector } from "react-redux";
import axios from "axios";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleFilled,
} from "@ant-design/icons";

const { TextArea } = Input;
const { confirm } = Modal;

function MyBooks() {
  console.log("MyBooks");
  const editFormRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data, setData] = useState([]);
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [bookToEdit, setBookToEdit] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const fileId = useSelector((state) => state.upload.fileId);
  const fileName = useSelector((state) => state.upload.fileName);
  const token = useSelector((state) => state.currentUser.token);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const showEditModal = useCallback(
    (book) => {
      setBookToEdit(book);
      editFormRef.current?.setFieldsValue({ ...book });
      setIsEditModalOpen(true);
    },
    [editFormRef]
  );

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const getData = useCallback(async () => {
    const response = await axios.get("http://localhost:5000/api/admin/books", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = response.data.data.map((b) => {
      return {
        key: b._id,
        title: b.title,
        description: b.description,
        author: b.author,
        category: b.category,
        isPublic: b.isPublic,
        cover: b.cover,
        fileName: b.fileName,
        language: b.language,
      };
    });
    setData(data);
  }, [token]);

  useEffect(() => {
    getData();
  }, [isLoading, getData]);

  const showDeleteBookConfirm = useCallback(
    (title, id) => {
      confirm({
        title: "Are you sure delete this book?",
        icon: <ExclamationCircleFilled />,
        content: <strong>{title}</strong>,
        okText: "Yes",
        okType: "danger",
        cancelText: "No",
        async onOk() {
          await axios.delete("http://localhost:5000/api/admin/delete/" + id, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          getData();
          messageApi.open({
            type: "success",
            content: "Your book has been deleted successfully",
          });
        },
        onCancel() {},
      });
    },
    [token, getData, messageApi]
  );
  const onSubmit = useCallback(async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/admin/create",
        {
          ...form.getFieldsValue(),
          fileName: fileName,
          cover: fileId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      messageApi.open({
        type: "success",
        content: "Your book has been created successfully",
      });

      setData([
        ...data,
        {
          ...form.getFieldsValue(),
          cover: fileId,
          fileName: fileName,
          key: data.length + 1,
          borrowedBy: "No User",
        },
      ]);
      getData();
      form.resetFields();
      setIsModalOpen(false);
    } catch (error) {
      messageApi.open({
        type: "error",
        content: "An error has occurred, please try again later",
      });
    }
  }, [messageApi, form, fileId, token, data, fileName, getData]);

  const onEdit = useCallback(async () => {
    setIsLoading(true);
    try {
      await axios.put(
        "http://localhost:5000/api/admin/edit/" + bookToEdit.key,
        {
          ...editFormRef.current?.getFieldsValue(),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      messageApi.open({
        type: "success",
        content: `You have successfully edit ${
          editFormRef.current?.getFieldsValue().title
        } 😀`,
      });
      setIsEditModalOpen(false);
    } catch (error) {
      messageApi.open({
        type: "error",
        content: "An error occured 😱",
      });
      console.error("error :", error);
    }
    setIsLoading(false);
  }, [messageApi, token, bookToEdit]);

  const handleEditModalCancel = useCallback(() => {
    setIsEditModalOpen(false);
    setBookToEdit(null);
  }, []);

  const onFinishFailed = (errorInfo) => {
    messageApi.open({
      type: "error",
      content: "Failed",
    });
  };

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
        title: "Description",
        dataIndex: "description",
        key: "description",
        width: 300,
      },
      {
        title: "Public",
        dataIndex: "isPublic",
        key: "public",
        width: 300,
        render: (isPublic) => (
          <>
            {isPublic ? (
              <CheckCircleOutlined className="text-[green]" />
            ) : (
              <CloseCircleOutlined className="text-[red]" />
            )}
          </>
        ),
      },
      {
        title: "Action",
        key: "action",
        width: 300,
        render: (_, record) => (
          <Space size="middle">
            <EditOutlined
              className="text-[blue] cursor-pointer"
              onClick={() => showEditModal(record)}
            />
            <DeleteOutlined
              className="text-[red] cursor-pointer"
              onClick={() => showDeleteBookConfirm(record.title, record.key)}
            />
          </Space>
        ),
      },
    ];
  }, [showEditModal, showDeleteBookConfirm]);

  return (
    <div className="p-4 w-full">
      {contextHolder}
      <Button
        type="primary"
        icon={<PlusOutlined />}
        className="bg-[#34abeb]"
        onClick={showModal}
      >
        New book
      </Button>
      <div className="flex flex-1 justify-center pt-4 w-full">
        <Table columns={columns} dataSource={data} />
      </div>
      {/* Add new book */}
      <Modal
        title="Add new book"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={onSubmit}
            htmlType="submit"
            className="bg-[#34abeb]"
          >
            Submit
          </Button>,
        ]}
      >
        <Form
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 14 }}
          layout="horizontal"
          initialValues={{ size: "default" }}
          style={{ maxWidth: 600 }}
          form={form}
          onFinish={onSubmit}
        >
          <Form.Item label="Title" name="title">
            <Input />
          </Form.Item>
          <Form.Item label="Description" name="description">
            <TextArea />
          </Form.Item>
          <Form.Item label="Author" name="author">
            <Input />
          </Form.Item>
          <Form.Item label="Category" name="category">
            <Select>
              <Select.Option value="romance">Romance</Select.Option>
              <Select.Option value="adventure">Adventure</Select.Option>
              <Select.Option value="science">Science</Select.Option>
              <Select.Option value="fantasy">Fantasy</Select.Option>
              <Select.Option value="tragedy">Tragedy</Select.Option>
              <Select.Option value="comedy">Comedy</Select.Option>
              <Select.Option value="horror">Horror</Select.Option>
              <Select.Option value="historical">Historical</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Language" name="language">
            <Select>
              <Select.Option value="arabe">Arabe</Select.Option>
              <Select.Option value="english">English</Select.Option>
              <Select.Option value="french">French</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Cover" name="cover">
            <UploadWidget name="" />
          </Form.Item>
          <Form.Item label="Public" name="isPublic" valuePropName="checked">
            <Checkbox />
          </Form.Item>
        </Form>
      </Modal>
      {/* Edit book */}
      <Modal
        title="Edit book"
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
            htmlType="submit"
            className="bg-[#34abeb]"
          >
            Edit
          </Button>,
        ]}
      >
        <Form
          ref={editFormRef}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 14 }}
          layout="horizontal"
          style={{
            maxWidth: 800,
            display: "flex-col",
            justifyContent: "center",
          }}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            label="Title"
            name="title"
            initialValue={bookToEdit?.title}
            rules={[{ required: true, message: "Please input your title !" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Description"
            name="description"
            initialValue={bookToEdit?.description}
            rules={[
              { required: true, message: "Please input your description !" },
            ]}
          >
            <TextArea />
          </Form.Item>

          <Form.Item
            label="Author"
            name="author"
            initialValue={bookToEdit?.author}
            rules={[{ required: true, message: "Please input your author!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Category"
            name="category"
            initialValue={bookToEdit?.category}
            rules={[
              {
                required: true,
                message: "Please input your category !",
              },
            ]}
          >
            <Select
              style={{ width: 275 }}
              onChange={(e) => console.log(e)}
              options={[
                { value: "romance", label: "Romance" },
                { value: "adventure", label: "Adventure" },
                { value: "science", label: "Science" },
                { value: "fantasy", label: "Fantasy" },
                { value: "horror", label: "Horror" },
                { value: "historical", label: "Historical" },
                { value: "historical", label: "Historical" },
              ]}
            />
          </Form.Item>
          <Form.Item
            label="Language"
            name="language"
            initialValue={bookToEdit?.language}
            rules={[
              {
                required: true,
                message: "Please input your language !",
              },
            ]}
          >
            <Select
              style={{ width: 275 }}
              options={[
                { value: "arabe", label: "Arabe" },
                { value: "english", label: "English" },
                { value: "french", label: "French" },
              ]}
            />
          </Form.Item>
          <Form.Item label="Cover" name="cover">
            <UploadWidget name={bookToEdit?.fileName} />
          </Form.Item>
          <Form.Item
            label="Public"
            name="isPublic"
            valuePropName="checked"
            initialValue={bookToEdit?.isPublic}
          >
            <Checkbox />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default MyBooks;

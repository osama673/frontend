import React, { useCallback } from "react";
import { Form, Input, Button, Card, message } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const NewAccount = () => {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();

  const onSubmit = useCallback(
    async (values) => {
      try {
        await axios
          .post("http://localhost:5000/api/user/register", values)
          .then((res) => {
            navigate("/login");
          })
          .catch((err) => console.dir(err));
        // messageApi.open({
        //   type: "success",
        //   content: "Your account has been created successfully",
        // });
        // form.resetFields();
      } catch (error) {
        messageApi.open({
          type: "error",
          content: "An error has occurred, please try again later",
        });
      }
    },
    [messageApi, navigate]
  );
  return (
    <>
      {contextHolder}
      <div
        className="flex flex-1 justify-center place-items-center"
        style={{
          paddingTop: "calc((100vh - 180px - 330px)/ 2)",
          paddingBottom: "calc((100vh - 180px - 330px)/ 2)",
        }}
      >
        <Card className="w-[1000px]">
          <Form
            form={form}
            variant="filled"
            className="flex-wrap justify-center flex-1"
            onFinish={onSubmit}
          >
            <Form.Item
              className="ml-6"
              label="Email"
              name="email"
              rules={[
                {
                  required: true,
                  message: "Please set your email!",
                },
                {
                  type: "email",
                  message: "The input is not valid E-mail!",
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="FirstName"
              name="firstName"
              rules={[
                { required: true, message: "Please set your firstName!" },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="LastName"
              name="lastName"
              rules={[
                { required: true, message: "Please set your last name!" },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please input your password!",
                },
                { type: "string", min: 8 },
              ]}
              hasFeedback
            >
              <Input.Password min={8} />
            </Form.Item>
            <Form.Item className="flex justify-end">
              <Button type="primary" htmlType="submit" className="bg-[#34abeb]">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </>
  );
};

export default NewAccount;

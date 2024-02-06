import React, { useState, useCallback } from "react";
import { Button, Card, Form, Input, message } from "antd";
import { PoweroffOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { jwtDecode } from "jwt-decode";
import {
  setIsLoggedIn,
  setIsAdmin,
  setToken,
  setCurrentUser,
} from "./currentUserSlice";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const onSubmit = useCallback(
    (data) => {
      setIsLoading(true);
      try {
        axios
          .post("http://localhost:5000/api/admin/login", data)
          .then((res) => {
            localStorage.setItem(
              "currentUser",
              JSON.stringify(res.data.data.user)
            );
            localStorage.setItem("token", JSON.stringify(res.data.data.token));
            dispatch(setCurrentUser(res.data.data.user));
            dispatch(setToken(res.data.data.token));
            dispatch(setIsLoggedIn(true));
            const isAdmin = jwtDecode(res.data.data.token).isAdmin;
            dispatch(setIsAdmin(isAdmin));
            navigate(isAdmin ? "/admin/dashboard" : "/user/dashboard");
          })
          .catch((err) => console.dir(err));
      } catch (error) {
        console.error(error);
        messageApi.open({
          type: "error",
          content: "An error has occurred, please try again later",
        });
      }
      setIsLoading(false);
    },
    [dispatch, navigate, messageApi]
  );

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div
      className="flex place-items-center justify-center w-screen"
      style={{ height: "calc(100vh - 180px)" }}
    >
      {contextHolder}
      <Card className="w-full mx-4 md:w-[400px]">
        <Form
          name="basic"
          initialValues={{ remember: true }}
          onFinish={onSubmit}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          layout="vertical"
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Please input your email!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="password"
            name="pwd"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password />
          </Form.Item>
          <div className="flex flex-1 justify-end pb-1">
            <a href="/account">Create new account</a>
          </div>

          <Form.Item>
            <Button
              className="min-w-full bg-[#34abeb]"
              type="primary"
              htmlType="submit"
              icon={isLoading && <PoweroffOutlined rev={"powerOff"} />}
              loading={isLoading}
            >
              {!isLoading && "Se connecter"}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}

export default Login;

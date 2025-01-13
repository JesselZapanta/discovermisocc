import GuestLayout from "@/Layouts/GuestLayout";
import { Head, router } from "@inertiajs/react";
import { Button, Form, Input } from "antd";
import { useState } from "react";
import { MailOutlined, LockOutlined, LoginOutlined } from "@ant-design/icons";
import axios from "axios";

export default function Login({ status, canResetPassword }) {

    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const handleSubmit = async (values) => {
        console.log(values);
        setLoading(true);

        try {
            const response = await axios.post("/login", values);

            if (response.data.status === "login") {
                router.visit("/dashboard");
            }
        } catch (err) {
            setErrors(err.response.data.errors);
        } finally {
            setLoading(false);
        }
    };

    return (
        <GuestLayout>
            <Head title="Log in" />

            {status && (
                <div className="mb-4 text-sm font-medium text-green-600">
                    {status}
                </div>
            )}
            <Form
                form={form}
                onFinish={handleSubmit}
                layout="vertical"
                autoComplete="off"
                initialValues={{
                    email: "",
                    password: "",
                }}
            >
                <Form.Item
                    label="EMAIL"
                    name="email"
                    validateStatus={errors?.email ? "error" : ""}
                    help={errors?.email ? errors?.email[0] : ""}
                >
                    <Input
                        placeholder="Email"
                        size="large"
                        prefix={<MailOutlined />}
                    />
                </Form.Item>
                <Form.Item
                    label="PASSWORD"
                    name="password"
                    validateStatus={errors?.password ? "error" : ""}
                    help={errors?.password ? errors?.password[0] : ""}
                >
                    <Input.Password
                        placeholder="Password"
                        type="password"
                        size="large"
                        prefix={<LockOutlined />}
                    />
                </Form.Item>
                <Form.Item>
                    <Button
                        htmlType="submit"
                        type="primary"
                        icon={<LoginOutlined />}
                        size="large"
                        block
                        disabled={loading}
                        loading={loading}
                    >
                        Login
                    </Button>
                </Form.Item>
            </Form>
            <div className="w-full flex justify-between">
                {canResetPassword && (
                    <Button type="link" href={route("password.request")}>
                        Forgot your password?
                    </Button>
                )}
                <Button type="link" href={route("register")}>
                    Dont have an Account?
                </Button>
            </div>
        </GuestLayout>
    );
}

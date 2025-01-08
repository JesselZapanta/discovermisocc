import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { useState } from "react";
import {
    Avatar,
    Button,
    Divider,
    Form,
    Input,
    message,
    notification,
    Row,
    Select,
    Space,
    Steps,
    Upload,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import {
    LockOutlined,
    MailOutlined,
    PlusOutlined,
    UserOutlined,
    UploadOutlined,
    CompassOutlined,
    PhoneOutlined,
} from "@ant-design/icons";

export default function Create({ auth }) {
    const [form] = Form.useForm();
    const [currentStep, setCurrentStep] = useState(0);
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState({});

    const handleSubmit = async (values) => {
        console.log("Form Values:", values); // Debugging

        const formData = new FormData();

        for (const key in values) {
            if (Array.isArray(values[key])) {
                values[key].forEach((file, index) =>
                    formData.append(`${key}[${index}]`, file.originFileObj)
                );
            } else {
                formData.append(key, values[key]);
            }
        }

        setProcessing(true); // Start processing
        setErrors({}); // Clear previous errors

        try {
            const response = await axios.post(
                "/entrepreneur/business/store",
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );

            if (response.data.status === "created") {
                handleCancel(); // Reset the form
                notification.success({
                    message: "Created!",
                    description: "The user has been created successfully.",
                    placement: "bottomRight",
                });
            }
        } catch (error) {
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            } else {
                notification.error({
                    message: "Error",
                    description: "An unexpected error occurred.",
                    placement: "bottomRight",
                });
            }
        } finally {
            setProcessing(false); // Stop processing
        }
    };

    const handleCancel = () => {
        form.resetFields();
    };

    const handleUploadChange = (e) => {
        return Array.isArray(e) ? e : e?.fileList;
    };

    const steps = [
        {
            title: "Basic Information",
            content: (
                <div className="grid gap-4 lg:grid-cols-3 sm:grid-cols-1">
                    <Form.Item
                        label="BUSINESS NAME"
                        name="name"
                        validateStatus={errors?.name ? "error" : ""}
                        help={errors?.name ? errors.name[0] : ""}
                        className="w-full"
                    >
                        <Input placeholder="Name" prefix={<UserOutlined />} />
                    </Form.Item>
                    <Form.Item
                        label="EMAIL"
                        name="email"
                        validateStatus={errors?.email ? "error" : ""}
                        help={errors?.email ? errors?.email[0] : ""}
                        className="w-full"
                    >
                        <Input placeholder="Email" prefix={<MailOutlined />} />
                    </Form.Item>
                    <Form.Item
                        label="CONTACT"
                        name="contact"
                        validateStatus={errors?.contact ? "error" : ""}
                        help={errors?.contact ? errors?.contact[0] : ""}
                        className="w-full"
                    >
                        <Input type="number" prefix={<PhoneOutlined />} />
                    </Form.Item>
                </div>
            ),
        },
        {
            title: "Address Details",
            content: (
                <>
                    <div className="grid gap-4 lg:grid-cols-2 sm:grid-cols-1">
                        <Form.Item
                            label="ADDRESS"
                            name="address"
                            validateStatus={errors?.address ? "error" : ""}
                            help={errors?.address ? errors.address[0] : ""}
                            className="w-full"
                        >
                            <Input prefix={<UserOutlined />} />
                        </Form.Item>
                        <Form.Item
                            label="CITY"
                            name="city"
                            validateStatus={errors?.city ? "error" : ""}
                            help={errors?.city ? errors?.city[0] : ""}
                            className="w-full"
                        >
                            <Select
                                options={[
                                    { value: 0, label: "city 1" },
                                    { value: 1, label: "city 2" },
                                ]}
                            />
                        </Form.Item>
                    </div>
                    <div className="grid gap-4 lg:grid-cols-2 sm:grid-cols-1">
                        <Form.Item
                            label="LATITUDE (OPTIONAL)"
                            name="latitude"
                            validateStatus={errors?.latitude ? "error" : ""}
                            help={errors?.latitude ? errors?.latitude[0] : ""}
                            className="w-full"
                        >
                            <Input
                                type="number"
                                prefix={<CompassOutlined />}
                                className="w-full"
                            />
                        </Form.Item>
                        <Form.Item
                            label="LONGITUDE (OPTIONAL)"
                            name="longitude"
                            validateStatus={errors?.longitude ? "error" : ""}
                            help={errors?.longitude ? errors?.longitude[0] : ""}
                            className="w-full"
                        >
                            <Input
                                type="number"
                                prefix={<CompassOutlined />}
                                className="w-full"
                            />
                        </Form.Item>
                    </div>
                </>
            ),
        },
        {
            title: "Description",
            content: (
                <Form.Item
                    label="DESCRIPTION"
                    name="description"
                    validateStatus={errors?.description ? "error" : ""}
                    help={errors?.description ? errors?.description[0] : ""}
                >
                    <TextArea
                        placeholder="Business Description"
                        allowClear
                        rows={4}
                    />
                </Form.Item>
            ),
        },
        {
            title: "Uploads",
            content: (
                <>
                    <Form.Item
                        label="LOGO"
                        name="logo"
                        valuePropName="fileList"
                        getValueFromEvent={handleUploadChange}
                        validateStatus={errors?.logo ? "error" : ""}
                        help={errors?.logo ? errors.logo[0] : ""}
                    >
                        <Upload listType="picture-card" maxCount={1}>
                            <div>
                                <UploadOutlined />
                                <div style={{ marginTop: 8 }}>Upload</div>
                            </div>
                        </Upload>
                    </Form.Item>

                    <Form.Item
                        label="BUSINESS IMAGES"
                        name="business_images"
                        valuePropName="fileList"
                        getValueFromEvent={handleUploadChange}
                        validateStatus={errors?.business_images ? "error" : ""}
                        help={
                            errors?.business_images
                                ? errors.business_images[0]
                                : ""
                        }
                    >
                        <Upload listType="picture" multiple>
                            <Button icon={<UploadOutlined />}>
                                Click to Upload
                            </Button>
                        </Upload>
                    </Form.Item>
                </>
            ),
        },
        {
            title: "Permits",
            content: (
                <>
                    <Form.Item
                        label="MAYOR'S PERMIT"
                        name="mayors_permit"
                        valuePropName="fileList"
                        getValueFromEvent={handleUploadChange}
                        validateStatus={errors?.mayors_permit ? "error" : ""}
                        help={
                            errors?.mayors_permit ? errors.mayors_permit[0] : ""
                        }
                    >
                        <Upload listType="picture" multiple>
                            <Button icon={<UploadOutlined />}>
                                Click to Upload
                            </Button>
                        </Upload>
                    </Form.Item>
                    <Form.Item
                        label="BUSINESS PERMIT"
                        name="business_permit"
                        valuePropName="fileList"
                        getValueFromEvent={handleUploadChange}
                        validateStatus={errors?.business_permit ? "error" : ""}
                        help={
                            errors?.business_permit
                                ? errors.business_permit[0]
                                : ""
                        }
                    >
                        <Upload listType="picture" multiple>
                            <Button icon={<UploadOutlined />}>
                                Click to Upload
                            </Button>
                        </Upload>
                    </Form.Item>
                    <Form.Item
                        label="BIR CLEARANCE"
                        name="bir_clearance"
                        valuePropName="fileList"
                        getValueFromEvent={handleUploadChange}
                        validateStatus={errors?.bir_clearance ? "error" : ""}
                        help={
                            errors?.bir_clearance ? errors.bir_clearance[0] : ""
                        }
                    >
                        <Upload listType="picture" multiple>
                            <Button icon={<UploadOutlined />}>
                                Click to Upload
                            </Button>
                        </Upload>
                    </Form.Item>
                </>
            ),
        },
    ];

    const next = () => {
        setCurrentStep((prev) => prev + 1);
    };

    const prev = () => {
        setCurrentStep((prev) => prev - 1);
    };

    return (
        <>
            <Steps current={currentStep}>
                {steps.map((step, index) => (
                    <Steps.Step key={index} title={step.title} />
                ))}
            </Steps>

            <Form
                form={form}
                layout="vertical"
                autoComplete="off"
                onFinish={handleSubmit}
                className="mt-4"
            >
                <div className="steps-content">
                    {steps[currentStep].content}
                </div>

                <Row justify="end" style={{ marginTop: 24 }}>
                    <Space size="small">
                        {currentStep > 0 && (
                            <Button type="default" onClick={prev}>
                                Previous
                            </Button>
                        )}
                        {currentStep < steps.length - 1 && (
                            <Button type="primary" onClick={next}>
                                Next
                            </Button>
                        )}
                        {currentStep === steps.length - 1 && (
                            <Button
                                htmlType="submit"
                                type="primary"
                                icon={<PlusOutlined />}
                                disabled={processing}
                                loading={processing}
                            >
                                Create
                            </Button>
                        )}
                    </Space>
                </Row>
            </Form>
        </>
    );
}

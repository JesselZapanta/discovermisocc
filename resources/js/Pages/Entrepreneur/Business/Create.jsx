import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage } from "@inertiajs/react";
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

    const [business, setBusiness] = useState(null)

    const [form] = Form.useForm();
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState({});

    const handleSubmit = async (values) => {
        setProcessing(true); // Start processing
        setErrors({}); // Clear previous errors

        try {
            const response = await axios.post(
                "/entrepreneur/business/store",
                values
            );

            // Handle success response
            if (response.data.status === "created") {
                handleCancel(); // Reset the form
                notification.success({
                    message: "Submitted!",
                    description:
                        "The business registration has been submitted successfully.",
                    placement: "bottomRight",
                });
            }
        } catch (error) {
            // Handle validation errors or other server errors
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

    const { props } = usePage();
    const csrfToken = props.auth.csrf_token || "";

    // For Logo

    const [tempLogo, setTempLogo] = useState("");
    const [isUpload, setIsUpload] = useState(false);

    const removeLogo = (logo) => {
        axios
            .post(`/entrepreneur/business/logo/temp-remove/${logo}`)
            .then((res) => {
                if (res.data.status === "remove") {
                    message.success("Logo removed.");
                    setIsUpload(false);
                }
                if (res.data.status === "error") {
                    alert("error");
                }
            });
    };

    const UploadLogoProps = {
        name: "logo",
        action: "/entrepreneur/business/logo/temp-upload",
        headers: {
            "X-CSRF-Token": csrfToken,
        },

        beforeUpload: (file) => {
            const isPNG = file.type === "image/png";
            const isJPG = file.type === "image/jpeg";

            if (!isPNG && !isJPG) {
                message.error(`${file.name} is not a png/jpg file.`);
            }
            return isPNG || isJPG || Upload.LIST_IGNORE;
        },

        onChange(info) {
            if (info.file.status === "done") {
                // Ensure the upload is complete
                if (business) {
                    axios
                        .post(`/entrepreneur/business/logo/replace/${business.id}/${business.logo}`)
                        .then((res) => {
                            if (res.data.status === "replace") {
                                message.success("File Replaced");
                            }
                        });
                } else {
                    message.success("Logo uploaded successfully.");
                    setTempLogo(info.file.response);
                    setIsUpload(true);
                }
            } else if (info.file.status === "error") {
                message.error("Logo upload failed.");
            }
        },

        onRemove(info) {
            // Prevent removal if user exists
            if (business) {
                message.error("You cannot remove the logo.");
                return false; // Prevent file removal
            }

            removeLogo(info.response);
            return true;
        },
    };

    const Uploadprops = {}

    return (
        <>
            <AuthenticatedLayout page="Register Business" auth={auth}>
                <Head title="Register Business" />

                <Form
                    form={form}
                    layout="vertical"
                    autoComplete="off"
                    onFinish={handleSubmit}
                    className="mt-4 max-w-5xl mx-auto bg-gray-100 p-8 rounded"
                >
                    <div className="grid gap-4 lg:grid-cols-3 sm:grid-cols-1">
                        <Form.Item
                            label="BUSINESS NAME"
                            name="name"
                            validateStatus={errors?.name ? "error" : ""}
                            help={errors?.name ? errors.name[0] : ""}
                            className="w-full"
                        >
                            <Input
                                placeholder="Name"
                                prefix={<UserOutlined />}
                            />
                        </Form.Item>
                        <Form.Item
                            label="EMAIL"
                            name="email"
                            validateStatus={errors?.email ? "error" : ""}
                            help={errors?.email ? errors?.email[0] : ""}
                            className="w-full"
                        >
                            <Input
                                placeholder="Email"
                                prefix={<MailOutlined />}
                            />
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
                    <Form.Item
                        label="LOGO"
                        name="logo"
                        valuePropName="fileList"
                        className="w-full"
                        getValueFromEvent={(e) =>
                            Array.isArray(e) ? e : e?.fileList
                        }
                        validateStatus={errors?.logo ? "error" : ""}
                        help={errors?.logo ? errors.logo[0] : ""}
                    >
                        <Upload
                            listType="picture"
                            maxCount={1}
                            {...UploadLogoProps}
                        >
                            <Button icon={<UploadOutlined />}>
                                Click to Upload
                            </Button>
                        </Upload>
                    </Form.Item>

                    <Form.Item
                        label="BUSINESS IMAGES"
                        name="busniness_images"
                        valuePropName="fileList"
                        className="w-full"
                        getValueFromEvent={(e) =>
                            Array.isArray(e) ? e : e?.fileList
                        }
                        validateStatus={errors?.busniness_images ? "error" : ""}
                        help={
                            errors?.busniness_images
                                ? errors.busniness_images[0]
                                : ""
                        }
                    >
                        <Upload listType="picture" multiple {...Uploadprops}>
                            <Button icon={<UploadOutlined />}>
                                Click to Upload
                            </Button>
                        </Upload>
                    </Form.Item>
                    <Form.Item
                        label="MAYOR'S PERMIT"
                        name="mayors_permit"
                        valuePropName="fileList"
                        className="w-full"
                        getValueFromEvent={(e) =>
                            Array.isArray(e) ? e : e?.fileList
                        }
                        validateStatus={errors?.mayors_permit ? "error" : ""}
                        help={
                            errors?.mayors_permit ? errors.mayors_permit[0] : ""
                        }
                    >
                        <Upload listType="picture" multiple {...Uploadprops}>
                            <Button icon={<UploadOutlined />}>
                                Click to Upload
                            </Button>
                        </Upload>
                    </Form.Item>
                    <Form.Item
                        label="BUSINESS'S PERMIT"
                        name="business_permit"
                        valuePropName="fileList"
                        className="w-full"
                        getValueFromEvent={(e) =>
                            Array.isArray(e) ? e : e?.fileList
                        }
                        validateStatus={errors?.business_permit ? "error" : ""}
                        help={
                            errors?.business_permit
                                ? errors.business_permit[0]
                                : ""
                        }
                    >
                        <Upload listType="picture" multiple {...Uploadprops}>
                            <Button icon={<UploadOutlined />}>
                                Click to Upload
                            </Button>
                        </Upload>
                    </Form.Item>
                    <Form.Item
                        label="BIR CLEARANCE"
                        name="bir_clearance"
                        valuePropName="fileList"
                        className="w-full"
                        getValueFromEvent={(e) =>
                            Array.isArray(e) ? e : e?.fileList
                        }
                        validateStatus={errors?.bir_clearance ? "error" : ""}
                        help={
                            errors?.bir_clearance ? errors.bir_clearance[0] : ""
                        }
                    >
                        <Upload listType="picture" multiple {...Uploadprops}>
                            <Button icon={<UploadOutlined />}>
                                Click to Upload
                            </Button>
                        </Upload>
                    </Form.Item>
                    <Row justify="end">
                        <Space size="small">
                            <Button type="default" onClick={handleCancel}>
                                Cancel
                            </Button>

                            <Button
                                htmlType="submit"
                                type="primary"
                                icon={<PlusOutlined />}
                                disabled={processing}
                                loading={processing}
                            >
                                Create
                            </Button>
                        </Space>
                    </Row>
                </Form>
            </AuthenticatedLayout>
        </>
    );
}

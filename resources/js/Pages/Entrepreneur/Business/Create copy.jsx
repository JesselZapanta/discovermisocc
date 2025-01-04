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
    Table,
    Tag,
    Upload,
} from "antd";
import Search from "antd/es/input/Search";
import {
    LockOutlined,
    MailOutlined,
    PlusOutlined,
    UserOutlined,
    EditOutlined,
    DeleteOutlined,
    QuestionCircleOutlined,
    UploadOutlined,
    CalendarOutlined,
    CompassOutlined,
} from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";

export default function Create({ auth }) {

    const [form] = Form.useForm();
    const [processing,setProcessing] = useState(null);
    const [errors, setErrors] = useState({});

    const handleSubmit = async (values) => {
        console.log(values);
    }

    const handleCancel = () => {
        console.log(values);
    }

    const  Uploadprops = [

    ]

    return (
        <AuthenticatedLayout auth={auth} page="Register business">
            <Head title="Register business" />

            <Form
                form={form}
                layout="vertical"
                autoComplete="off"
                onFinish={handleSubmit}
            >
                <Divider orientation="left">Basic Information</Divider>
                <div className="grid gap-4 lg:grid-cols-3 sm:grid-cols-1">
                    <Form.Item
                        label="BUSINESS NAME"
                        name="name"
                        // Custom error handling
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
                        <Input type="number" prefix={<MailOutlined />} />
                    </Form.Item>
                </div>
                <Divider orientation="left">Basic Information</Divider>
                <div className="grid gap-4 lg:grid-cols-2 sm:grid-cols-1">
                    <Form.Item
                        label="ADDRESS"
                        name="address"
                        // Custom error handling
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
                <Divider orientation="left">Basic Information</Divider>
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
                <Divider orientation="left">Basic Information</Divider>
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
                        listType="picture-card"
                        maxCount={1}
                        {...Uploadprops}
                    >
                        <div>
                            <UploadOutlined />
                            <div style={{ marginTop: 8 }}>Upload</div>
                        </div>
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
                <Divider orientation="left">Basic Information</Divider>
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
                        errors?.mayors_permit
                            ? errors.mayors_permit[0]
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
                        errors?.bir_clearance
                            ? errors.bir_clearance[0]
                            : ""
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
    );
}

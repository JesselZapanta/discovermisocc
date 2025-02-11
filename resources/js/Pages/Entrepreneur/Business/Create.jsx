import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router, usePage } from "@inertiajs/react";
import { useState } from "react";
import {
    Button,
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

export default function Create({ auth, business }) {
    // const [business, setBusiness] = useState(null);

    console.log(business);


    const [form] = Form.useForm();
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState({});

    if (business) {

        const logo = business.logo
            ? [
                {
                    uid: "-1",
                    name: business.logo,
                    url: `/storage/logos/${business.logo}`,
                },
            ]
            : [];

        const mayor_permit = business.mayor_permit
            ? [
                {
                    uid: "-1",
                    name: business.mayor_permit,
                    url: `/storage/mayor_permit/${business.mayor_permit}`,
                },
            ]
            : [];

        const business_permit = business.business_permit
            ? [
                {
                    uid: "-1",
                    name: business.business_permit,
                    url: `/storage/business_permit/${business.business_permit}`,
                },
            ]
            : [];

        const bir_clearance = business.bir_clearance
            ? [
                {
                    uid: "-1",
                    name: business.bir_clearance,
                    url: `/storage/bir_clearance/${business.bir_clearance}`,
                },
            ]
            : [];

        form.setFieldsValue({
            name: business.name,
            email: business.email,
            contact: business.contact,
            address: business.address,
            city: business.city,
            latitude: business.latitude,
            longitude: business.longitude,
            description: business.description,
            logo: logo,
            mayor_permit: mayor_permit,
            business_permit: business_permit,
            bir_clearance: bir_clearance,
        });
    } else {
        form.resetFields();
    }

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
            setErrors(err.response.data.errors);
        } finally {
            setProcessing(false); // Stop processing
        }
    };

    const handleCancel = () => {
        form.resetFields();

        //remove the images
        if (isLogoUpload) {
            removeAvatar(tempLogo);
        }

        if (isMayorPermitUpload) {
            removeMayorPermit(tempMayorPermit);
        }

        router.visit(route("entrepreneur.business"));
    };

    const { props } = usePage();
    const csrfToken = props.auth.csrf_token || "";

    // For Logo

    const [tempLogo, setTempLogo] = useState("");
    const [isLogoUpload, setIsLogoUpload] = useState(false);

    const removeLogo = (logo) => {
        axios.post(`/entrepreneur/logo-temp-remove/${logo}`).then((res) => {
            if (res.data.status === "remove") {
                message.success("Logo removed.");
                setIsLogoUpload(false);
            }
            if (res.data.status === "error") {
                alert("error");
            }
        });
    };

    const UploadLogoProps = {
        name: "logo",
        action: "/entrepreneur/logo-temp-upload",
        headers: {
            "X-CSRF-Token": csrfToken,
        },

        beforeUpload: (file) => {
            if (isLogoUpload) {
                message.error(
                    "You cannot upload a new logo while one is already uploaded."
                );
                return Upload.LIST_IGNORE;
            }

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
                        .post(
                            `/entrepreneur/logo-image-replace/${business.id}/${business.logo}`
                        )
                        .then((res) => {
                            if (res.data.status === "replace") {
                                message.success("File Replaced");
                            }
                        });
                } else {
                    message.success("Logo uploaded successfully.");
                    setTempLogo(info.file.response);
                    setIsLogoUpload(true);
                }
            } else if (info.file.status === "error") {
                message.error("Logo upload failed.");
            }
        },

        onRemove(info) {
            // Prevent removal if business exists
            if (business) {
                message.error("You cannot remove the logo.");
                return false; // Prevent file removal
            }

            removeLogo(info.response);
            return true;
        },
    };

    // For MayorPermit

    const [tempMayorPermit, setTempMayorPermit] = useState("");
    const [isMayorPermitUpload, setIsMayorPermitUpload] = useState(false);

    const removeMayorPermit = (filename) => {
        axios
            .post(`/entrepreneur/mayor-permit-temp-remove/${filename}`)
            .then((res) => {
                if (res.data.status === "remove") {
                    message.success("Mayor's permit removed.");
                    setIsMayorPermitUpload(false);
                }
                if (res.data.status === "error") {
                    alert("error");
                }
            });
    };

    const UploadMayorPermitProps = {
        name: "mayor_permit",
        action: "/entrepreneur/mayor-permit-temp-upload",
        headers: {
            "X-CSRF-Token": csrfToken,
        },

        beforeUpload: (file) => {
            if (isMayorPermitUpload) {
                message.error(
                    "You cannot upload a new mayor's permit while one is already uploaded."
                );
                return Upload.LIST_IGNORE;
            }

            const isPDF = file.type === "application/pdf";

            if (!isPDF) {
                message.error(`${file.name} is not a PDF file.`);
            }
            return isPDF || Upload.LIST_IGNORE;
        },

        onChange(info) {
            if (info.file.status === "done") {
                // Ensure the upload is complete
                if (business) {
                    axios
                        .post(
                            `/entrepreneur/mayor-permit-image-replace/${business.id}/${business.mayor_permit}`
                        )
                        .then((res) => {
                            if (res.data.status === "replace") {
                                message.success("File Replaced");
                            }
                        });
                } else {
                    message.success("Mayor's permit uploaded successfully.");
                    setTempMayorPermit(info.file.response);
                    setIsMayorPermitUpload(true);
                }
            } else if (info.file.status === "error") {
                message.error("Mayor's permit upload failed.");
            }
        },

        onRemove(info) {
            // Prevent removal if business exists
            if (business) {
                message.error("You cannot remove the mayor's permit.");
                return false; // Prevent file removal
            }

            removeMayorPermit(info.response);
            return true;
        },
    };

    // For BusinessPermit

    const [tempBusinessPermit, setTempBusinessPermit] = useState("");
    const [isBusinessPermitUpload, setIsBusinessPermitUpload] = useState(false);

    const removeBusinessPermit = (filename) => {
        axios
            .post(`/entrepreneur/business-permit-temp-remove/${filename}`)
            .then((res) => {
                if (res.data.status === "remove") {
                    message.success("Business permit removed.");
                    setIsBusinessPermitUpload(false);
                }
                if (res.data.status === "error") {
                    alert("error");
                }
            });
    };

    const UploadBusinessPermitProps = {
        name: "business_permit",
        action: "/entrepreneur/business-permit-temp-upload",
        headers: {
            "X-CSRF-Token": csrfToken,
        },

        beforeUpload: (file) => {
            if (isBusinessPermitUpload) {
                message.error(
                    "You cannot upload a new business permit while one is already uploaded."
                );
                return Upload.LIST_IGNORE;
            }

            const isPDF = file.type === "application/pdf";

            if (!isPDF) {
                message.error(`${file.name} is not a PDF file.`);
            }
            return isPDF || Upload.LIST_IGNORE;
        },

        onChange(info) {
            if (info.file.status === "done") {
                // Ensure the upload is complete
                if (business) {
                    axios
                        .post(
                            `/entrepreneur/business-permit-image-replace/${business.id}/${business.mayor_permit}`
                        )
                        .then((res) => {
                            if (res.data.status === "replace") {
                                message.success("File Replaced");
                            }
                        });
                } else {
                    message.success("Business's permit uploaded successfully.");
                    setTempBusinessPermit(info.file.response);
                    setIsBusinessPermitUpload(true);
                }
            } else if (info.file.status === "error") {
                message.error("Business permit upload failed.");
            }
        },

        onRemove(info) {
            // Prevent removal if business exists
            if (business) {
                message.error("You cannot remove the business permit.");
                return false; // Prevent file removal
            }

            removeBusinessPermit(info.response);
            return true;
        },
    };

    // For Bir

    const [tempBir, setTempBir] = useState("");
    const [isBirUpload, setIsBirUpload] = useState(false);

    const removeBir = (filename) => {
        axios
            .post(`/entrepreneur/bir-temp-remove/${filename}`)
            .then((res) => {
                if (res.data.status === "remove") {
                    message.success("Business permit removed.");
                    setIsBirUpload(false);
                }
                if (res.data.status === "error") {
                    alert("error");
                }
            });
    };

    const UploadBirProps = {
        name: "bir_clearance",
        action: "/entrepreneur/bir-temp-upload",
        headers: {
            "X-CSRF-Token": csrfToken,
        },

        beforeUpload: (file) => {
            if (isBirUpload) {
                message.error(
                    "You cannot upload a new bir clearance while one is already uploaded."
                );
                return Upload.LIST_IGNORE;
            }

            const isPDF = file.type === "application/pdf";

            if (!isPDF) {
                message.error(`${file.name} is not a PDF file.`);
            }
            return isPDF || Upload.LIST_IGNORE;
        },

        onChange(info) {
            if (info.file.status === "done") {
                // Ensure the upload is complete
                if (business) {
                    axios
                        .post(
                            `/entrepreneur/bir-image-replace/${business.id}/${business.bir_clearance}`
                        )
                        .then((res) => {
                            if (res.data.status === "replace") {
                                message.success("File Replaced");
                            }
                        });
                } else {
                    message.success("Bir clearance uploaded successfully.");
                    setTempBir(info.file.response);
                    setIsBirUpload(true);
                }
            } else if (info.file.status === "error") {
                message.error("Bir clearance upload failed.");
            }
        },

        onRemove(info) {
            // Prevent removal if business exists
            if (business) {
                message.error("You cannot remove the Bir clearance.");
                return false; // Prevent file removal
            }

            removeBir(info.response);
            return true;
        },
    };

    const Uploadprops = {};


    return (
        <>
            <AuthenticatedLayout page="Register Business" auth={auth}>
                <Head title="Register Business" />

                <pre className="text-gray-900">
                    {JSON.stringify(business, null, 2)}
                </pre>

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
                        name="mayor_permit"
                        valuePropName="fileList"
                        className="w-full"
                        getValueFromEvent={(e) =>
                            Array.isArray(e) ? e : e?.fileList
                        }
                        validateStatus={errors?.mayor_permit ? "error" : ""}
                        help={
                            errors?.mayor_permit ? errors.mayor_permit[0] : ""
                        }
                    >
                        <Upload listType="picture" {...UploadMayorPermitProps}>
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
                        <Upload
                            listType="picture"
                            {...UploadBusinessPermitProps}
                        >
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
                        <Upload listType="picture" {...UploadBirProps}>
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

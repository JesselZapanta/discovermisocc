import GuestLayout from "@/Layouts/GuestLayout";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { Button, Form, Input, message, Select, Upload } from "antd";
import { useEffect, useState } from "react";
import {
    MailOutlined,
    LockOutlined,
    LoginOutlined,
    UserOutlined,
    CalendarOutlined,
    UploadOutlined,
} from "@ant-design/icons";
import axios from "axios";

export default function Register() {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const handleSubmit = async (values) => {
        console.log(values);
        setLoading(true);

        try {
            const response = await axios.post("/register", values);

            if (response.data.status === "register") {
                router.visit("/dashboard");
            }
        } catch (err) {
            setErrors(err.response.data.errors);
        } finally {
            setLoading(false);
        }
    };

    //for location

    const [regions, setRegions] = useState([]);
    const [provinces, setProvinces] = useState([]);
    const [cities, setCities] = useState([]);
    const [barangays, setBarangays] = useState([]);

    const [selectedRegion, setSelectedRegion] = useState("");
    const [selectedProvince, setSelectedProvince] = useState("");
    const [selectedCity, setSelectedCity] = useState("");

    const [type, setType] = useState(0);

    //fetch regions
    useEffect(() => {
        const fetchRegions = async () => {
            try {
                const response = await axios.get(
                    "https://psgc.gitlab.io/api/regions/"
                );
                setRegions(response.data);
            } catch (err) {
                console.log(err);
            }
        };
        fetchRegions();
    }, []);

    // Fetch Provinces based on selected Region
    useEffect(() => {
        const fetchProvinces = async () => {
            if (selectedRegion) {
                try {
                    const response = await axios.get(
                        `https://psgc.gitlab.io/api/regions/${selectedRegion}/provinces/`
                    );
                    setProvinces(response.data);
                } catch (err) {
                    console.log(err);
                }
            } else {
                setCities([]);
            }
            setCities([]);
            setBarangays([]);
            setSelectedProvince("");
            setSelectedCity("");
        };

        fetchProvinces();
    }, [selectedRegion]);

    console.log(selectedProvince);

    // Fetch Cities based on selected Province
    useEffect(() => {
        const fetchCities = async () => {
            if (selectedProvince) {
                try {
                    const response = await axios.get(
                        `https://psgc.gitlab.io/api/provinces/${selectedProvince}/cities-municipalities/`
                    );
                    setCities(response.data);
                } catch (error) {
                    console.error("Error fetching cities:", error);
                }
            } else {
                setCities([]);
            }
            setBarangays([]);
            setSelectedCity("");
        };

        fetchCities();
    }, [selectedProvince]);

    // Fetch Barangays based on selected City
    useEffect(() => {
        const fetchBarangays = async () => {
            if (selectedCity) {
                try {
                    const response = await axios.get(
                        `https://psgc.gitlab.io/api/cities-municipalities/${selectedCity}/barangays/`
                    );
                    setBarangays(response.data);
                } catch (error) {
                    console.error("Error fetching barangays:", error);
                }
            } else {
                setBarangays([]);
            }
        };

        fetchBarangays();
    }, [selectedCity]);

    //for avatar upload

    const { props } = usePage();
    const csrfToken = props.auth.csrf_token || "";

    const [tempAvatar, setTempAvatar] = useState("");
    const [isUpload, setIsUpload] = useState(false);

    const removeAvatar = (avatar) => {
        axios.post(`/register/avatar-temp-remove/${avatar}`).then((res) => {
            if (res.data.status === "remove") {
                message.success("Avatar removed.");
                setIsUpload(false);
            }
            if (res.data.status === "error") {
                alert("error");
            }
        });
    };

    const Uploadprops = {
        name: "avatar",
        action: "/register/avatar-temp-upload",
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
                if (user) {
                    axios
                        .post(
                            `/register/avatar-image-replace/${user.id}/${user.avatar}`
                        )
                        .then((res) => {
                            if (res.data.status === "replace") {
                                message.success("File Replaced");
                            }
                        });
                } else {
                    message.success("Avatar uploaded successfully.");
                    setTempAvatar(info.file.response);
                    setIsUpload(true);
                }
            } else if (info.file.status === "error") {
                message.error("Avatar upload failed.");
            }
        },

        onRemove(info) {
            // Prevent removal if user exists
            // if (user) {
            //     message.error("You cannot remove the avatar.");
            //     return false; // Prevent file removal
            // }

            removeAvatar(info.response);
            return true;
        },
    };

    return (
        <GuestLayout>
            <Head title="Register" />

            <Form
                form={form}
                onFinish={handleSubmit}
                layout="vertical"
                autoComplete="off"
                initialValues={{
                    name: "",
                    email: "",
                    password: "",
                }}
            >
                <div className="grid gap-4 lg:grid-cols-2 sm:grid-cols-1">
                    <Form.Item
                        label="NAME"
                        name="name"
                        validateStatus={errors?.name ? "error" : ""}
                        help={errors?.name ? errors.name[0] : ""}
                    >
                        <Input placeholder="Name" prefix={<UserOutlined />} />
                    </Form.Item>
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
                </div>

                <div className="grid gap-4 lg:grid-cols-2 sm:grid-cols-1">
                    <Form.Item
                        label="SEX"
                        name="sex"
                        validateStatus={errors?.sex ? "error" : ""}
                        help={errors?.sex ? errors?.sex[0] : ""}
                        className="w-full"
                    >
                        <Select
                            options={[
                                { value: "Male", label: "Male" },
                                { value: "Female", label: "Female" },
                            ]}
                        />
                    </Form.Item>
                    <Form.Item
                        label="BIRTHDATE"
                        name="birthdate"
                        validateStatus={errors?.birthdate ? "error" : ""}
                        help={errors?.birthdate ? errors?.birthdate[0] : ""}
                        className="w-full"
                    >
                        <Input
                            type="date"
                            prefix={<CalendarOutlined />}
                            className="w-full"
                        />
                    </Form.Item>
                </div>
                <div className="grid gap-4 lg:grid-cols-2 sm:grid-cols-1">
                    <Form.Item
                        label="ROLE"
                        name="role"
                        validateStatus={errors?.role ? "error" : ""}
                        help={errors?.role ? errors?.role[0] : ""}
                        className="w-full"
                    >
                        <Select
                            options={[
                                { value: 1, label: "Tourist" },
                                { value: 3, label: "Entrepreneur" },
                            ]}
                        />
                    </Form.Item>
                    <Form.Item
                        label="TYPE"
                        name="type"
                        validateStatus={errors?.type ? "error" : ""}
                        help={errors?.type ? errors?.type[0] : ""}
                        className="w-full"
                    >
                        <Select
                            onChange={(value) => setType(value)}
                            options={[
                                { value: 0, label: "Domestic" },
                                { value: 1, label: "International" },
                            ]}
                        />
                    </Form.Item>
                </div>

                {/* show only if  */}
                {type === 0 && (
                    <div className="grid gap-4 lg:grid-cols-2 sm:grid-cols-1">
                        <Form.Item
                            label="REGION"
                            name="region"
                            validateStatus={errors?.region ? "error" : ""}
                            help={errors?.region ? errors?.region[0] : ""}
                            className="w-full"
                        >
                            <Select
                                value={selectedRegion}
                                onChange={(value) => setSelectedRegion(value)}
                            >
                                {regions.map((region) => (
                                    <Option
                                        key={region.code}
                                        value={region.code}
                                    >
                                        {region.name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item
                            label="PROVINCE"
                            name="province"
                            validateStatus={errors?.province ? "error" : ""}
                            help={errors?.province ? errors?.province[0] : ""}
                            className="w-full"
                        >
                            <Select
                                value={selectedProvince}
                                onChange={(value) => setSelectedProvince(value)}
                                disabled={!selectedRegion}
                            >
                                {provinces.map((province) => (
                                    <Option
                                        key={province.code}
                                        value={province.code}
                                    >
                                        {province.name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item
                            label="CITY"
                            name="city"
                            validateStatus={errors?.city ? "error" : ""}
                            help={errors?.city ? errors?.city[0] : ""}
                            className="w-full"
                        >
                            <Select
                                value={selectedCity}
                                onChange={(value) => setSelectedCity(value)}
                                disabled={!selectedProvince}
                            >
                                {cities.map((city) => (
                                    <Option key={city.code} value={city.code}>
                                        {city.name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item
                            label="BARANGAY"
                            name="barangay"
                            validateStatus={errors?.barangay ? "error" : ""}
                            help={errors?.barangay ? errors?.barangay[0] : ""}
                            className="w-full"
                        >
                            <Select disabled={!selectedCity}>
                                {barangays.map((barangay) => (
                                    <Option
                                        key={barangay.code}
                                        value={barangay.code}
                                    >
                                        {barangay.name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </div>
                )}

                {type === 1 && (
                    <Form.Item
                        label="COUNTRY"
                        name="country"
                        validateStatus={errors?.country ? "error" : ""}
                        help={errors?.country ? errors?.country[0] : ""}
                        className="w-full"
                    >
                        <Select
                            onChange={(value) => setType(value)}
                            options={[
                                { value: 0, label: "1" },
                                { value: 1, label: "3" },
                            ]}
                        />
                    </Form.Item>
                )}

                <div className="grid gap-4 lg:grid-cols-2 sm:grid-cols-1">
                    <Form.Item
                        label="PASSWORD"
                        name="password"
                        validateStatus={errors?.password ? "error" : ""}
                        help={errors?.password ? errors?.password[0] : ""}
                    >
                        <Input.Password
                            placeholder="Password"
                            type="password"
                            prefix={<LockOutlined />}
                        />
                    </Form.Item>

                    <Form.Item
                        label="RE-TYPE PASSWORD"
                        name="password_confirmation"
                        validateStatus={
                            errors?.password_confirmation ? "error" : ""
                        }
                        help={
                            errors?.password_confirmation
                                ? errors?.password_confirmation[0]
                                : ""
                        }
                    >
                        <Input.Password
                            placeholder="Re-type Password"
                            type="password"
                            prefix={<LockOutlined />}
                        />
                    </Form.Item>
                </div>
                <Form.Item
                    label="AVATAR"
                    name="avatar"
                    valuePropName="fileList"
                    className="w-full"
                    getValueFromEvent={(e) =>
                        Array.isArray(e) ? e : e?.fileList
                    }
                    validateStatus={errors?.avatar ? "error" : ""}
                    help={errors?.avatar ? errors.avatar[0] : ""}
                >
                    <Upload listType="picture" maxCount={1} {...Uploadprops}>
                        <Button icon={<UploadOutlined />}>
                            Click to Upload
                        </Button>
                    </Upload>
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
                        Register
                    </Button>
                </Form.Item>
            </Form>
            <div className="mt-4 flex items-center justify-end">
                <Button type="link" href={route("login")}>
                    Already registered?
                </Button>
            </div>
        </GuestLayout>
    );
}

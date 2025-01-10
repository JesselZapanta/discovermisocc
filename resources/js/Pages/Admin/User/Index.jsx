import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage } from "@inertiajs/react";
import {
    Avatar,
    Button,
    Form,
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
} from "@ant-design/icons";
import Modal from "antd/es/modal/Modal";
import { useEffect, useState } from "react";
import Input from "antd/es/input/Input";
import axios from "axios";
import Column from "antd/es/table/Column";

export default function Index({ auth }) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [searching, setSearching] = useState(false);
    const [sortField, setSortField] = useState("id");
    const [sortOrder, setSortOrder] = useState("asc");

    const getData = async (isSearch = false) => {
        if (isSearch) {
            setSearching(true);
        }
        setLoading(true);

        const params = [
            `page=${page}`,
            `search=${search}`,
            `sortField=${sortField}`,
            `sortOrder=${sortOrder}`,
        ].join("&");

        try {
            const res = await axios.get(`/admin/user/getdata?${params}`);
            setData(res.data.data);
            setTotal(res.data.total);
        } catch {
            console.log(err);
        } finally {
            setLoading(false);
            setSearching(false);
        }
    };

    //antd onchange table has 3 params
    const handleTableChange = (pagination, filters, sorter) => {
        setSortField(sorter.field || "id");
        setSortOrder(sorter.order === "ascend" ? "asc" : "desc");
        setPage(pagination.current);
    };

    useEffect(() => {
        getData(false);
    }, [page, sortField, sortOrder]);

    const [user, setUser] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [api, contextHolder] = notification.useNotification();
    const openNotification = (type, placement, title, msg) => {
        api[type]({
            message: title,
            description: msg,
            placement: placement,
        });
    };

    const [form] = Form.useForm();
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState({});

    const showCreateModal = () => {
        setIsModalOpen(true);
        form.resetFields();
    };

    const showEditModal = (user) => {
        setIsModalOpen(true);
        setUser(user);
        
        setType(user.type);

        if(user.type === 1){
            setSelectedRegion("");
            setSelectedProvince("");
            setSelectedCity("");
        }

        const avatar = user.avatar
                ? [
                    {
                        uid: "-1",
                        name: user.avatar,
                        url: `/storage/avatars/${user.avatar}`,
                    },
                ]
                : [];

        form.setFieldsValue({
            name: user.name,
            email: user.email,
            role: user.role,
            status: user.status,
            birthdate: user.birthdate,
            type: user.type,
            region: user.region || "",
            province: user.province || "",
            city: user.city || "",
            barangay: user.barangay || "",
            password: "",
            avatar: avatar,
        });
    };

    //for avatar upload

    const { props } = usePage();
    const csrfToken = props.auth.csrf_token || "";

    const [tempAvatar, setTempAvatar] = useState("");
    const [isUpload, setIsUpload] = useState(false);

    const removeAvatar = (avatar) => {
        axios.post(`/avatar-temp-remove/${avatar}`).then((res) => {
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
        action: "/avatar-temp-upload",
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
                        .post(`/avatar-image-replace/${user.id}/${user.avatar}`)
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
            if (user) {
                message.error("You cannot remove the avatar.");
                return false; // Prevent file removal
            }

            removeAvatar(info.response);
            return true;
        },
    };

    const handleSubmit = async (values) => {
        setProcessing(true);

        if (user) {
            try {
                const res = await axios.put(
                    `/admin/user/update/${user.id}`,
                    values
                );
                if (res.data.status === "updated") {
                    handleCancel();
                    openNotification(
                        "success",
                        "bottomRight",
                        "Updated!",
                        "The user has been updated successfully."
                    );
                }
            } catch (err) {
                setErrors(err.response.data.errors);
            } finally {
                setProcessing(false);
            }
        } else {
            try {
                const res = await axios.post("/admin/user/store", values);
                if (res.data.status === "created") {
                    handleCancel();
                    openNotification(
                        "success",
                        "bottomRight",
                        "Created!",
                        "The user has been created successfully."
                    );
                }
            } catch (err) {
                setErrors(err.response.data.errors);
            } finally {
                setProcessing(false);
            }
        }
    };

    //cancel modal and form
    const handleCancel = () => {
        setIsModalOpen(false);
        setUser(false);
        form.resetFields();
        setErrors({});
        getData();

        if (isUpload) {
            removeAvatar(tempAvatar);
        }
    };

    const handleDelete = async (id) => {
        setLoading(true);

        try {
            const res = await axios.delete(`/admin/user/destroy/${id}`);

            if (res.data.status === "deleted") {
                handleCancel();
                openNotification(
                    "success",
                    "bottomRight",
                    "Deleted!",
                    "The user has been deleted successfully."
                );
            }
        } catch (err) {
            console.log(err);
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

    return (
        <AuthenticatedLayout page="User Management" auth={auth}>
            <Head title="User Management" />
            {contextHolder}
            <div className="py-2">List of Users</div>
            <div className="flex gap-2 mb-2">
                <Search
                    placeholder="Input name or email"
                    allowClear
                    enterButton="Search"
                    loading={searching}
                    onChange={(e) => setSearch(e.target.value)}
                    onSearch={() => getData(true)}
                />
                <Button
                    type="primary"
                    onClick={showCreateModal}
                    icon={<PlusOutlined />}
                >
                    New
                </Button>
            </div>
            <div className="overflow-x-auto">
                <Table
                    loading={loading}
                    dataSource={data}
                    rowKey={(data) => data.id}
                    pagination={{
                        current: page,
                        total: total,
                        pageSize: 10,
                        showSizeChanger: false,
                        onChange: (page) => setPage(page),
                    }}
                    onChange={handleTableChange}
                >
                    <Column sorter={true} title="ID" dataIndex="id" key="id" />

                    <Column
                        title="Avatar"
                        dataIndex="avatar"
                        key="avatar"
                        render={(avatar) => (
                            <Avatar
                                size="large"
                                src={`/storage/avatars/${avatar}`}
                                icon={<UserOutlined />}
                            />
                        )}
                    />

                    <Column
                        sorter={true}
                        title="Name"
                        dataIndex="name"
                        key="name"
                    />
                    <Column
                        sorter={true}
                        title="Email"
                        dataIndex="email"
                        key="email"
                    />

                    <Column
                        sorter={true}
                        title="Status"
                        dataIndex="status"
                        key="status"
                        render={(_, record) =>
                            record.status === 0 ? (
                                <Tag color="yellow">Inactive</Tag>
                            ) : (
                                <Tag color="green">Active</Tag>
                            )
                        }
                    />

                    <Column
                        sorter={true}
                        title="Type"
                        dataIndex="type"
                        key="type"
                        render={(_, record) =>
                            record.type === 0 ? (
                                <Tag color="geekblue">Domestic</Tag>
                            ) : (
                                <Tag color="purple">International</Tag>
                            )
                        }
                    />

                    <Column
                        title="Role"
                        dataIndex="role"
                        key="role"
                        render={(_, record) =>
                            record.role === 0 ? (
                                <Tag color="#f50">Admin</Tag>
                            ) : record.role === 1 ? (
                                <Tag color="#2db7f5">Tourist</Tag>
                            ) : record.role === 2 ? (
                                <Tag color="#87d068">Facilitator</Tag>
                            ) : (
                                <Tag color="#108ee9">Entrepreneur</Tag>
                            )
                        }
                    />

                    <Column
                        title="Action"
                        key="action"
                        render={(_, record) => (
                            <Space>
                                <Button
                                    type="primary"
                                    shape="square"
                                    icon={<EditOutlined />}
                                    onClick={() => showEditModal(record)}
                                ></Button>
                                <Button
                                    danger
                                    shape="square"
                                    icon={<DeleteOutlined />}
                                    onClick={() =>
                                        Modal.confirm({
                                            title: "Delete?",
                                            icon: <QuestionCircleOutlined />,
                                            content:
                                                "Are you sure you want to delete this data?",
                                            okText: "Yes",
                                            cancelText: "No",
                                            onOk() {
                                                handleDelete(record.id);
                                            },
                                        })
                                    }
                                />
                            </Space>
                        )}
                    />
                </Table>
            </div>

            <Modal
                title={user ? "UPDATE USER INFORMATION" : "USER INFORMATION"}
                open={isModalOpen}
                onCancel={handleCancel}
                maskClosable={false}
                width={700}
                footer={false}
            >
                <Form
                    form={form}
                    layout="vertical"
                    autoComplete="off"
                    onFinish={handleSubmit}
                >
                    <Form.Item>
                        <Form.Item
                            label="NAME"
                            name="name"
                            // Custom error handling
                            validateStatus={errors?.name ? "error" : ""}
                            help={errors?.name ? errors.name[0] : ""}
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
                        >
                            <Input
                                placeholder="Email"
                                prefix={<MailOutlined />}
                            />
                        </Form.Item>

                        <div className="flex gap-4">
                            <Form.Item
                                label="ROLE"
                                name="role"
                                validateStatus={errors?.role ? "error" : ""}
                                help={errors?.role ? errors?.role[0] : ""}
                                className="w-full"
                            >
                                <Select
                                    options={[
                                        { value: 0, label: "Admin" },
                                        { value: 1, label: "Tourist" },
                                        { value: 2, label: "Facilator" },
                                        { value: 3, label: "Entrepreneur" },
                                    ]}
                                />
                            </Form.Item>
                            <Form.Item
                                label="STATUS"
                                name="status"
                                validateStatus={errors?.status ? "error" : ""}
                                help={errors?.status ? errors?.status[0] : ""}
                                className="w-full"
                            >
                                <Select
                                    options={[
                                        { value: 1, label: "Active" },
                                        { value: 0, label: "Inactive" },
                                    ]}
                                />
                            </Form.Item>
                        </div>
                        <div className="flex gap-4">
                            <Form.Item
                                label="BIRTHDATE"
                                name="birthdate"
                                validateStatus={
                                    errors?.birthdate ? "error" : ""
                                }
                                help={
                                    errors?.birthdate
                                        ? errors?.birthdate[0]
                                        : ""
                                }
                                className="w-full"
                            >
                                <Input
                                    type="date"
                                    prefix={<CalendarOutlined />}
                                    className="w-full"
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
                                    validateStatus={
                                        errors?.region ? "error" : ""
                                    }
                                    help={
                                        errors?.region ? errors?.region[0] : ""
                                    }
                                    className="w-full"
                                >
                                    <Select
                                        value={selectedRegion}
                                        onChange={(value) =>
                                            setSelectedRegion(value)
                                        }
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
                                    validateStatus={
                                        errors?.province ? "error" : ""
                                    }
                                    help={
                                        errors?.province
                                            ? errors?.province[0]
                                            : ""
                                    }
                                    className="w-full"
                                >
                                    <Select
                                        value={selectedProvince}
                                        onChange={(value) =>
                                            setSelectedProvince(value)
                                        }
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
                                        onChange={(value) =>
                                            setSelectedCity(value)
                                        }
                                        disabled={!selectedProvince}
                                    >
                                        {cities.map((city) => (
                                            <Option
                                                key={city.code}
                                                value={city.code}
                                            >
                                                {city.name}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>

                                <Form.Item
                                    label="BARANGAY"
                                    name="barangay"
                                    validateStatus={
                                        errors?.barangay ? "error" : ""
                                    }
                                    help={
                                        errors?.barangay
                                            ? errors?.barangay[0]
                                            : ""
                                    }
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
                                {user ? "Update" : "Create"}
                            </Button>
                        </Space>
                    </Row>
                </Form>
            </Modal>
        </AuthenticatedLayout>
    );
}

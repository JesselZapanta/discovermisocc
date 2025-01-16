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
    const [sortOrder, setSortOrder] = useState("desc");

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
            const res = await axios.get(`/admin/facilatator/getdata?${params}`);
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

    const [facilatator, setFacilatator] = useState(false);
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

    const showEditModal = (facilatator) => {
        setIsModalOpen(true);
        setFacilatator(facilatator);

        const avatar = facilatator.avatar
            ? [
                  {
                      uid: "-1",
                      name: facilatator.avatar,
                      url: `/storage/avatars/${facilatator.avatar}`,
                  },
              ]
            : [];

        form.setFieldsValue({
            name: facilatator.name,
            email: facilatator.email,
            role: facilatator.role,
            status: facilatator.status,
            sex: facilatator.sex,
            birthdate: facilatator.birthdate,
            city: facilatator.city || "",
            barangay: facilatator.barangay || "",
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
            if (isUpload) {
                message.error(
                    "You cannot upload a new avatar while one is already uploaded."
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
                if (facilatator) {
                    axios
                        .post(
                            `/avatar-image-replace/${facilatator.id}/${facilatator.avatar}`
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
            // Prevent removal if facilatator exists
            if (facilatator) {
                message.error("You cannot remove the avatar.");
                return false; // Prevent file removal
            }

            removeAvatar(info.response);
            return true;
        },
    };

    const handleSubmit = async (values) => {
        setProcessing(true);

        if (facilatator) {
            try {
                const res = await axios.put(
                    `/admin/facilatator/update/${facilatator.id}`,
                    values
                );
                if (res.data.status === "updated") {
                    handleCancel();
                    openNotification(
                        "success",
                        "bottomRight",
                        "Updated!",
                        "The facilatator has been updated successfully."
                    );
                }
            } catch (err) {
                setErrors(err.response.data.errors);
            } finally {
                setProcessing(false);
            }
        } else {
            try {
                const res = await axios.post(
                    "/admin/facilatator/store",
                    values
                );
                if (res.data.status === "created") {
                    handleCancel();
                    openNotification(
                        "success",
                        "bottomRight",
                        "Created!",
                        "The facilatator has been created successfully."
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
        setFacilatator(false);
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
            const res = await axios.delete(`/admin/facilatator/destroy/${id}`);

            if (res.data.status === "deleted") {
                handleCancel();
                openNotification(
                    "success",
                    "bottomRight",
                    "Deleted!",
                    "The facilatator has been deleted successfully."
                );
            }
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    //for location

    const selectedProvince = 104200000;

    const [cities, setCities] = useState([]);
    const [barangays, setBarangays] = useState([]);

    const [selectedCity, setSelectedCity] = useState("");

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

    //100000000 = Code for north mindanao
    //104200000  = code for mis occ
    return (
        <AuthenticatedLayout page="Facilatator Management" auth={auth}>
            <Head title="Facilatator Management" />
            {contextHolder}
            <div className="py-2">List of Facilatators</div>
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
                title={
                    facilatator ? "UPDATE USER INFORMATION" : "USER INFORMATION"
                }
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
                                        { value: 2, label: "Facilator" },
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
                        </div>

                        <div className="grid gap-4 lg:grid-cols-2 sm:grid-cols-1">
                            <Form.Item
                                label="TYPE"
                                name="type"
                                className="w-full"
                            >
                                <Select
                                    disabled
                                    defaultValue={0}
                                    options={[{ value: 0, label: "Domestic" }]}
                                />
                            </Form.Item>
                            <Form.Item
                                label="COUNTRY"
                                name="type"
                                className="w-full"
                            >
                                <Select
                                    disabled
                                    defaultValue={138}
                                    options={[
                                        { value: 138, label: "Philippines" },
                                    ]}
                                />
                            </Form.Item>
                            <Form.Item
                                label="REGION"
                                name="region"
                                className="w-full"
                            >
                                <Select
                                    disabled
                                    defaultValue={100000000}
                                    options={[
                                        {
                                            value: 100000000,
                                            label: "Northern Mindanao",
                                        },
                                    ]}
                                />
                            </Form.Item>
                            <Form.Item
                                label="PROVINCE"
                                name="province"
                                className="w-full"
                            >
                                <Select
                                    disabled
                                    defaultValue={104200000}
                                    options={[
                                        {
                                            value: 104200000,
                                            label: "Misamis Occidental",
                                        },
                                    ]}
                                />
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
                                validateStatus={errors?.barangay ? "error" : ""}
                                help={
                                    errors?.barangay ? errors?.barangay[0] : ""
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
                                {facilatator ? "Update" : "Create"}
                            </Button>
                        </Space>
                    </Row>
                </Form>
            </Modal>
        </AuthenticatedLayout>
    );
}

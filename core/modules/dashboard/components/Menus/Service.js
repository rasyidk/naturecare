import React, { createElement, useEffect, useRef, useState } from "react";
import { BsSearch } from "react-icons/bs";
import { Button } from "../../../common/button";
import Swal from "sweetalert2";
import Modal from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import axios from "axios";
import Image from "next/image";
import jwtDecode from "jwt-decode";

const Service = () => {
  const jwt =
    "bearer " + JSON.parse(localStorage.getItem("userData")).data.data.jwToken;
  const klinikId = jwtDecode(jwt).data.klinik_id;
  const [service, setService] = useState("");
  const [capacity, setCapacity] = useState("");
  const [open, setOpen] = useState(false);
  const [data, setData] = useState(null);
  const [submit, setSubmit] = useState(false);

  const handleSubmit = () => {
    if (service && capacity) {
      axios({
        url: `${process.env.NEXT_PUBLIC_BE_URL}/api/service/post`,
        method: "post",
        headers: {
          authorization: jwt,
        },
        data: {
          service_name: service,
          capacity,
        },
      })
        .then((res) => {
          Swal.fire("Sukses", "Data berhasil ditambahkan", "success");
          setOpen(false);
          setService(null);
          setCapacity(null);
          setSubmit(!submit);
        })
        .catch((error) => {
          console.log(error);
          Swal.fire(
            "Gagal",
            "Sedang terjadi galat asilahakan coba kembali",
            "warning"
          );
        });
    } else {
      Swal.fire(
        "Terjadi Kesalahan",
        "Harap isi semua data dengan benar!",
        "info"
      );
    }
  };

  const handleDelete = (id) => {
    axios({
      method: "delete",
      url: `${process.env.NEXT_PUBLIC_BE_URL}/api/service/${id}`,
      headers: {
        authorization: jwt,
      },
    })
      .then((res) => {
        Swal.fire("Data telah dihapus", "", "success");
        setSubmit(!submit);
      })
      .catch((e) => {
        Swal.fire(
          "Gagal",
          "Sedang terjadi galat silahakan coba kembali",
          "warning"
        );
      });
  };

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_BE_URL}/api/service/klinik/` + klinikId)
      .then((res) => {
        setData(res.data.data);
      });
  }, [submit]);

  if (!data) {
    return <></>;
  }
  return (
    <>
      <h1 className="md:text-4xl text-xl font-semibold capitalize py-8 text-primary-text">
        List Layanan
      </h1>
      <div className="bg-white  py-12 px-8 rounded-xl shadow-sm overflow-x-auto overflow-y-auto max-h-[75vh]">
        <div className="flex justify-end gap-5">
          <Button
            type="primary"
            className=" rounded-xl q px-3 text-sm font-semibold"
            onClick={() => setOpen(true)}
          >
            Tambah Layanan
          </Button>
        </div>
        <table className="mt-10 table-auto w-full align-left border-spacing-2">
          <thead className="text-left">
            <tr>
              <th className="capitalize text-secondary-text font-semibold col-span-2 w-96">
                Nomor
              </th>
              <th className="capitalize text-secondary-text font-semibold w-96">
                Nama Layanan
              </th>
              <th className="capitalize text-secondary-text font-semibold w-96">
                Kapasitas
              </th>
              <th className="capitalize text-secondary-text font-semibold w-96">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="color-primary-text">
            {data.map((e, i) => {
              return (
                <tr
                  key={i}
                  className="h-16 border-b border-b-2 border-b-gray-100 py-2"
                >
                  <td>{i + 1}</td>
                  <td>{e.service_name}</td>
                  <td>{e.capacity}</td>

                  <td className="max-w-[4rem]">
                    <Button
                      children="Hapus"
                      type="primary"
                      className="rounded-xl text-sm py-2 px-5 bg-red-500 ml-1"
                      onClick={() => {
                        Swal.fire({
                          title: "Hapus Data?",
                          icon: "warning",
                          showCancelButton: true,
                          confirmButtonColor: "#3085d6",
                          cancelButtonColor: "#d33",
                          confirmButtonText: "Ya",
                        }).then((result) => {
                          if (result.isConfirmed) {
                            handleDelete(e.service_id);
                            setData(data.filter((a) => a.id !== e.id));
                          }
                        });
                      }}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          center
          styles={{ modal: { padding: "50px 20px", width: "80vw" } }}
        >
          <h2 className="text-xl font-medium text-primary-blue">
            Tambah Kategori
          </h2>
          <div className="flex flex-col">
            <label htmlFor="service" className="mt-8 mb-2">
              Nama Service
            </label>
            <input
              type="text"
              name="service"
              id="service"
              value={service}
              onChange={(e) => setService(e.target.value)}
              className=" border-2 border-grey-accent p-3 rounded-xl duration-500 focus:border-primary-blue outline-none w-full"
            />
            <label htmlFor="capacity" className="mt-8 mb-2">
              Kapasitas Per Hari
            </label>
            <input
              type="number"
              name="capacity"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              className=" border-2 border-grey-accent p-3 rounded-xl duration-500 focus:border-primary-blue outline-none w-full"
            />
          </div>
          <Button
            type="primary"
            className="mt-10 rounded-xl shadow-xl w-full"
            onClick={handleSubmit}
          >
            Tambahkan
          </Button>
        </Modal>
      </div>
    </>
  );
};

export default Service;

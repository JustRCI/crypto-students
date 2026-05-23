"use client";
import { useEffect, useState } from "react";

export default function CustomAlert() {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const handleShowAlert = (e) => {
      const { message, type } = e.detail;
      const id = Date.now() + Math.random();
      
      setAlerts((prev) => [...prev, { id, message, type }]);

      // Auto close after 4 seconds
      setTimeout(() => {
        setAlerts((prev) => prev.filter((alert) => alert.id !== id));
      }, 4000);
    };

    window.addEventListener("show-alert", handleShowAlert);
    return () => window.removeEventListener("show-alert", handleShowAlert);
  }, []);

  const closeAlert = (id) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  };

  const getAlertConfig = (type) => {
    switch (type) {
      case "success":
        return {
          containerClass: "alert-success",
          iconClass: "fa-check-circle faa-tada animated",
          title: "Berhasil!",
          closeIconClass: "greencross",
        };
      case "danger":
        return {
          containerClass: "alert-danger",
          iconClass: "fa-times-circle faa-pulse animated",
          title: "Kesalahan!",
          closeIconClass: "danger",
        };
      case "warning":
        return {
          containerClass: "alert-warning",
          iconClass: "fa-exclamation-triangle faa-flash animated",
          title: "Peringatan!",
          closeIconClass: "warning",
        };
      case "info":
        return {
          containerClass: "alert-info",
          iconClass: "fa-info-circle faa-shake animated",
          title: "Informasi!",
          closeIconClass: "blue-cross",
        };
      case "primary":
      default:
        return {
          containerClass: "alert-primary",
          iconClass: "fa-thumbs-up faa-bounce animated",
          title: "Pemberitahuan!",
          closeIconClass: "alertprimary",
        };
    }
  };

  if (alerts.length === 0) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: "20px",
        right: "20px",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        maxWidth: "400px",
      }}
    >
      {alerts.map((alert) => {
        const config = getAlertConfig(alert.type);
        return (
          <div
            key={alert.id}
            className={`alert fade alert-simple ${config.containerClass} alert-dismissible text-left font__family-montserrat font__size-16 font__weight-light brk-library-rendered rendered show`}
            style={{ position: "relative", marginBottom: "0", padding: "15px", borderRadius: "4px" }}
            role="alert"
          >
            <button
              type="button"
              className="close font__size-18"
              onClick={() => closeAlert(alert.id)}
              style={{
                position: "absolute",
                right: "10px",
                top: "10px",
                background: "transparent",
                border: "none",
                cursor: "pointer",
              }}
            >
              <span aria-hidden="true">
                <i className={`fa fa-times ${config.closeIconClass}`}></i>
              </span>
              <span className="sr-only" style={{ display: "none" }}>Close</span>
            </button>
            <i className={`start-icon far ${config.iconClass}`} style={{ marginRight: "10px", fontSize: "1.2rem" }}></i>
            <strong className="font__weight-semibold">{config.title}</strong>{" "}
            <span style={{ color: "white", textShadow: "none" }}>{alert.message}</span>
          </div>
        );
      })}
    </div>
  );
}

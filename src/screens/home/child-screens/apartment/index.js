import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { fetchAvailableApartments } from "../../../../endpoints/apartment.service";
import DateTimePicker from "@react-native-community/datetimepicker";

const generateDateRange = (startDate, endDate) => {
  let dates = [];
  let currentDate = new Date(startDate);
  const lastDate = new Date(endDate);

  while (currentDate <= lastDate) {
    dates.push(new Date(currentDate).toISOString().split("T")[0]);
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
};

const ApartmentList = () => {
  const [showAvailable, setShowAvailable] = useState(false);
  const [availableApt, setAvailableApt] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showFromDatePicker, setShowFromDatePicker] = useState(false);
  const [showToDatePicker, setShowToDatePicker] = useState(false);
  const [apartments, setApartments] = useState([]);
  const [visibleApartments, setVisibleApartments] = useState(5);
  const [showApt, setShowApt] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  const _fetchAvailableApartments = async () => {
    try {
      const start = startDate.toISOString();
      const checkOut = endDate.toISOString();
      const apartments = await fetchAvailableApartments(start, checkOut);
      setAvailableApt(apartments);
      setShowApt(true);
    } catch (error) {
      console.error("Error fetching available apartments:", error);
    }
  };

  const handleStartDateChange = (event, selectedDate) => {
    setShowFromDatePicker(false);
    if (selectedDate) setStartDate(selectedDate);
  };

  const handleEndDateChange = (event, selectedDate) => {
    setShowToDatePicker(false);
    if (selectedDate) setEndDate(selectedDate);
  };
  const totalPages = Math.ceil(availableApt.length / rowsPerPage);

  const displayedApartments = availableApt.slice(0, visibleApartments);
  const handleRowsPerPageChange = (numRows) => {
    setVisibleApartments(numRows);
    setDropdownVisible(false);
  };

  const renderApartmentRow = ({ item }) => (
    <View style={styles.apartmentRow}>
      <Text style={styles.apartmentName}>{item.name}</Text>
      <ScrollView horizontal>
        {generateDateRange(startDate, endDate).map((date, index) => (
          <View
            key={index}
            style={[
              styles.availabilityItem,
              item.isActive ? styles.available : styles.unavailable,
            ]}
          >
            <Text style={styles.availabilityText}>
              {item.isActive ? "✓" : ""}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.datecard}>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            onPress={() => setShowAvailable(!showAvailable)}
            style={[styles.dateBox, { backgroundColor: "#fff" }]}
          >
            <View style={styles.dropdownHeader}>
              <Text style={styles.dropdownText}>Date Range</Text>
              <Icon
                name={showAvailable ? "chevron-up" : "chevron-down"}
                size={20}
                color="#000"
              />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={{ marginLeft: 14 }}
            onPress={_fetchAvailableApartments}
          >
            <Icon name="search" size={28} color="#000000" />
          </TouchableOpacity>
        </View>

        {showAvailable && (
          <View>
            <View style={styles.datePickerContainer}>
              <Text>From:</Text>
              <TouchableOpacity
                onPress={() => setShowFromDatePicker(true)}
                style={styles.dateButton}
              >
                <Text>{startDate.toDateString()}</Text>
              </TouchableOpacity>
              {showFromDatePicker && (
                <DateTimePicker
                  value={startDate}
                  mode="date"
                  display="default"
                  onChange={handleStartDateChange}
                />
              )}
            </View>

            <View style={styles.datePickerContainer}>
              <Text>To:</Text>
              <TouchableOpacity
                onPress={() => setShowToDatePicker(true)}
                style={styles.dateButton}
              >
                <Text>{endDate.toDateString()}</Text>
              </TouchableOpacity>
              {showToDatePicker && (
                <DateTimePicker
                  value={endDate}
                  mode="date"
                  display="default"
                  onChange={handleEndDateChange}
                />
              )}
            </View>
          </View>
        )}
      </View>
      {showApt ? (
        <>
          <View style={styles.headerRow}>
            <Text style={styles.headerText}>Apt Name</Text>
            <ScrollView horizontal>
              {generateDateRange(startDate, endDate).map((date, index) => (
                <Text key={index} style={styles.headerText}>
                  {date.split("-")[2]}/{date.split("-")[1]}
                </Text>
              ))}
            </ScrollView>
          </View>
          <FlatList
            data={displayedApartments}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderApartmentRow}
          />
          <View style={styles.paginationContainer}>
            <View style={{ position: "relative" }}>
              <TouchableOpacity
                style={styles.paginationButton}
                onPress={() => setDropdownVisible(!dropdownVisible)}
              >
                <Text style={styles.paginationText}>
                  {visibleApartments} Rows
                </Text>
                <Icon
                  name={dropdownVisible ? "chevron-up" : "chevron-down"}
                  size={20}
                  color="#000"
                />
              </TouchableOpacity>
              {dropdownVisible && (
                <View style={styles.dropdown}>
                  {[5, 10, 15, 20].map((num) => (
                    <TouchableOpacity
                      key={num}
                      style={styles.dropdownItem}
                      onPress={() => handleRowsPerPageChange(num)}
                    >
                      <Text style={styles.dropdownText}>{num} Rows</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
            <Text style={styles.paginationText}>
              {" "}
              1-{visibleApartments} of {apartments.length}
            </Text>
            <View style={styles.paginationIcons}>
              <MaterialIcons
                name="keyboard-double-arrow-left"
                size={20}
                color="#000"
              />
              <MaterialIcons name="chevron-left" size={20} color="#000" />
              <MaterialIcons name="chevron-right" size={20} color="#000" />
              <MaterialIcons
                name="keyboard-double-arrow-right"
                size={20}
                color="#000"
              />
            </View>
          </View>
        </>
      ) : (
        <Text style={{ textAlign: "center" }}>Please Select Date</Text>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  datecard: {
    display: "flex",
    flexDirection: "column",
    borderRadius: 6,
    borderColor: "#E5E4E2",
    borderWidth: 1,
    margin: 20,
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  dateBox: {
    width: "50%",
    padding: 15,
    borderColor: "#A9A9A9",
    borderWidth: 1,
    borderRadius: 10,
  },
  dropdownHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dropdownText: {
    fontSize: 16,
    fontWeight: "500",
  },
  datePickerContainer: {
    marginVertical: 10,
  },
  dateButton: {
    padding: 10,
    backgroundColor: "#E9EAEC",
    borderRadius: 5,
    marginTop: 5,
  },
  headerRow: {
    flexDirection: "row",
    padding: 10,
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerText: {
    fontSize: 14,
    fontWeight: "bold",
    marginHorizontal: 8,
    color: "#979797",
  },
  apartmentRow: {
    flexDirection: "row",
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#ccc",
    justifyContent: "space-between",
    alignItems: "center",
  },
  apartmentName: {
    fontSize: 16,
    fontWeight: "bold",
    width: Dimensions.get("window").width / 4,
  },
  availabilityItem: {
    width: Dimensions.get("window").width / 10,
    justifyContent: "space-between",
    alignItems: "center",
    padding: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    // borderRadius: 4,
    marginRight: 12,
  },
  availabilityText: {
    fontSize: 16,
    color: "#ffffff",
  },
  available: {
    backgroundColor: "#7b68ee",
  },
  unavailable: {
    backgroundColor: "#ffffff",
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  paginationButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 8,
    borderColor: "#A9A9A9",
    borderWidth: 1,
    borderRadius: 4,
  },
  paginationText: {
    fontSize: 12,
  },
  paginationIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
});

export default ApartmentList;

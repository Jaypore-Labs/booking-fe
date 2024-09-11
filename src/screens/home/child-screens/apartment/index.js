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

const generateDates = (startDate, numDays) => {
  let dates = [];
  for (let i = 0; i < numDays; i++) {
    let date = new Date(startDate);
    date.setDate(date.getDate() + i);
    dates.push(date.toISOString().split("T")[0]);
  }
  return dates;
};

const generateDummyData = () => {
  const apartments = [];
  for (let i = 1; i <= 30; i++) {
    const availability = generateDates(new Date(), 120).map((date) => ({
      date,
      available: Math.random() > 0.5,
    }));
    apartments.push({ id: i, name: `Apartment ${i}`, availability });
  }
  return apartments;
};

const ApartmentList = () => {
  const [apartments, setApartments] = useState([]);
  const [visibleApartments, setVisibleApartments] = useState(5);
  const [showInfo, setShowInfo] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setApartments(generateDummyData());
  }, []);

  const totalPages = Math.ceil(apartments.length / rowsPerPage);

  const displayedApartments = apartments.slice(0, visibleApartments);
  const handleRowsPerPageChange = (numRows) => {
    setVisibleApartments(numRows);
    setDropdownVisible(false);
  };

  const renderApartmentRow = ({ item }) => (
    <View style={styles.apartmentRow}>
      <Text style={styles.apartmentName}>{item.name}</Text>
      <ScrollView horizontal>
        {item.availability.slice(0, 20).map((day, index) => (
          <View
            key={index}
            style={[
              styles.availabilityItem,
              day.available ? styles.available : styles.unavailable,
            ]}
          >
            {/* <Text style={styles.availabilityText}>{day.date.split("-")[2]}</Text> */}
            <Text style={styles.availabilityText}>
              {day.available ? "✓" : ""}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.datecard}>
        <TouchableOpacity style={[styles.dateBox, { backgroundColor: "#fff" }]}>
          <View style={styles.dropdownHeader}>
            <Text style={styles.dropdownText}>Date Range</Text>
            <Icon
              name={showInfo ? "chevron-up" : "chevron-down"}
              size={20}
              color="#000"
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ marginLeft: 14 }}
          onPress={() => console.log("Navigate to search")}
        >
          <Icon name="search" size={28} color="#000000" />
        </TouchableOpacity>
      </View>
      <View style={styles.headerRow}>
        <Text style={styles.headerText}>Apt Name</Text>
        <ScrollView horizontal>
          {generateDates(new Date(), 20).map((date, index) => (
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
            <Text style={styles.paginationText}>{visibleApartments} Rows</Text>
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  datecard: {
    flexDirection: "row",
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

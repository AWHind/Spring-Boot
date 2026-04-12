package com.maisonelysia.service;

import com.maisonelysia.dto.ReservationDTO;
import com.maisonelysia.model.Reservation;
import com.maisonelysia.repository.ReservationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReservationService {

    @Autowired
    private ReservationRepository reservationRepository;

    public List<ReservationDTO> getAllReservations() {
        return reservationRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public ReservationDTO getReservationById(Long id) {
        return reservationRepository.findById(id)
                .map(this::convertToDTO)
                .orElse(null);
    }

    public ReservationDTO createReservation(ReservationDTO reservationDTO) {
        Reservation reservation = convertToEntity(reservationDTO);
        reservation.setCreatedAt(LocalDateTime.now());
        Reservation savedReservation = reservationRepository.save(reservation);
        return convertToDTO(savedReservation);
    }

    public ReservationDTO updateReservation(Long id, ReservationDTO reservationDTO) {
        return reservationRepository.findById(id)
                .map(reservation -> {
                    reservation.setName(reservationDTO.getName());
                    reservation.setEmail(reservationDTO.getEmail());
                    reservation.setPhone(reservationDTO.getPhone());
                    reservation.setReservationDate(reservationDTO.getReservationDate());
                    reservation.setNumberOfGuests(reservationDTO.getNumberOfGuests());
                    reservation.setSpecialRequests(reservationDTO.getSpecialRequests());
                    Reservation updated = reservationRepository.save(reservation);
                    return convertToDTO(updated);
                })
                .orElse(null);
    }

    public void deleteReservation(Long id) {
        reservationRepository.deleteById(id);
    }

    private ReservationDTO convertToDTO(Reservation reservation) {
        return new ReservationDTO(
                reservation.getId(),
                reservation.getName(),
                reservation.getEmail(),
                reservation.getPhone(),
                reservation.getReservationDate(),
                reservation.getNumberOfGuests(),
                reservation.getSpecialRequests(),
                reservation.getCreatedAt()
        );
    }

    private Reservation convertToEntity(ReservationDTO reservationDTO) {
        return new Reservation(
                reservationDTO.getId(),
                reservationDTO.getName(),
                reservationDTO.getEmail(),
                reservationDTO.getPhone(),
                reservationDTO.getReservationDate(),
                reservationDTO.getNumberOfGuests(),
                reservationDTO.getSpecialRequests(),
                reservationDTO.getCreatedAt()
        );
    }

}

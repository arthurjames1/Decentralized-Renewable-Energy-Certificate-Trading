;; Generation Verification Contract
;; Validates clean energy production

(define-data-var admin principal tx-sender)

;; Data structure for energy generators
(define-map generators principal
  {
    name: (string-utf8 100),
    location: (string-utf8 100),
    capacity: uint,
    verified: bool
  }
)

;; Data structure for energy production records
(define-map production-records uint
  {
    generator: principal,
    amount: uint,
    timestamp: uint,
    verified: bool
  }
)

(define-data-var next-record-id uint u0)

;; Register a new energy generator
(define-public (register-generator (name (string-utf8 100)) (location (string-utf8 100)) (capacity uint))
  (begin
    (asserts! (not (default-to false (get verified (map-get? generators tx-sender)))) (err u1))
    (map-set generators tx-sender {
      name: name,
      location: location,
      capacity: capacity,
      verified: false
    })
    (ok true)
  )
)

;; Admin verifies a generator
(define-public (verify-generator (generator principal))
  (begin
    (asserts! (is-eq tx-sender (var-get admin)) (err u403))
    (asserts! (is-some (map-get? generators generator)) (err u404))
    (map-set generators generator
      (merge (unwrap-panic (map-get? generators generator)) { verified: true })
    )
    (ok true)
  )
)

;; Generator submits energy production
(define-public (submit-production (amount uint))
  (let ((generator-data (map-get? generators tx-sender)))
    (asserts! (is-some generator-data) (err u404))
    (asserts! (get verified (unwrap-panic generator-data)) (err u401))
    (let ((record-id (var-get next-record-id)))
      (map-set production-records record-id {
        generator: tx-sender,
        amount: amount,
        timestamp: block-height,
        verified: false
      })
      (var-set next-record-id (+ record-id u1))
      (ok record-id)
    )
  )
)

;; Admin verifies production record
(define-public (verify-production (record-id uint))
  (begin
    (asserts! (is-eq tx-sender (var-get admin)) (err u403))
    (asserts! (is-some (map-get? production-records record-id)) (err u404))
    (map-set production-records record-id
      (merge (unwrap-panic (map-get? production-records record-id)) { verified: true })
    )
    (ok true)
  )
)

;; Read-only function to get production record
(define-read-only (get-production-record (record-id uint))
  (map-get? production-records record-id)
)

;; Read-only function to get generator info
(define-read-only (get-generator-info (generator principal))
  (map-get? generators generator)
)

;; Transfer admin rights
(define-public (transfer-admin (new-admin principal))
  (begin
    (asserts! (is-eq tx-sender (var-get admin)) (err u403))
    (var-set admin new-admin)
    (ok true)
  )
)

